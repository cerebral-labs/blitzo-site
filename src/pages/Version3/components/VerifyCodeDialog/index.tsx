import { useEffect, useMemo, useRef, useState } from "react";
import {
  useLoginWithEmail,
  usePrivy,
  useUser,
  useLoginWithSms,
} from "@privy-io/react-auth";
import { AnimatePresence, motion } from "motion/react";

interface VerifyCodeDialogProps {
  open: boolean;
  onClose: () => void;
  onVerified?: (userData: any) => void; // ⭐ 确保接收参数
  params: any;
}

export default function VerifyCodeDialog({
  open,
  onClose,
  params,
  onVerified,
}: VerifyCodeDialogProps) {
  const { data: emailOrPhone, mode } = params;

  const { sendCode, loginWithCode } = useLoginWithEmail(); // 邮箱登录

  const { sendCode: sendPhoneCode, loginWithCode: loginWithPhoneCode } =
    useLoginWithSms(); // 绑定手机

  const { getAccessToken } = usePrivy();
  const { refreshUser } = useUser();

  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const canResend = useMemo(() => countdown <= 0, [countdown]);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // 从URL获取invite_code
  const getInviteCodeFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("invite_code") || "";
  };

  // 调用后端登录接口
  const loginToBackend = async (token: string) => {
    try {
      const inviteCode = getInviteCodeFromUrl();

      const response = await fetch("https://blitzo.xyz/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_data: "",
          invite_code: inviteCode,
          token: token,
        }),
      });

      const data = await response.json();
      console.log("Backend login response:", data);

      if (data.code === 0) {
        console.log("Login successful!");
        console.log("User info:", data.data.user);
        console.log("Is first time:", data.data.first);
        console.log("Backend token:", data.data.token);

        // ⭐ 关键修改：调用 onVerified 并传递用户数据
        onVerified?.({
          linked_accounts: data.data.user.linked_accounts, // ⭐ 传递完整的 linked_accounts
          username: data.data.user.name || data.data.user.email,
          balance: 5,
          referralCode: data.data.user.invite_code,
        });
      } else {
        console.error("Login failed:", data.message);
        setError(data.message);
      }

      return data;
    } catch (error) {
      console.error("Error calling backend login API:", error);
      setError("Login failed, please try again");
      throw error;
    }
  };

  useEffect(() => {
    if (!open) return;
    if (countdown <= 0) return;
    const id = setInterval(
      () => setCountdown((s) => (s > 0 ? s - 1 : 0)),
      1000
    );
    return () => clearInterval(id);
  }, [countdown, open]);

  useEffect(() => {
    if (!open) {
      setDigits(Array(6).fill(""));
      setIsVerifying(false);
      setIsSending(false);
      setCountdown(0);
      setError(null);
      return;
    }
    handleSend();
    setTimeout(() => inputsRef.current[0]?.focus(), 0);
  }, [open]);

  useEffect(() => {
    const isempty = digits.some((i) => i == "");
    if (!isempty) {
      handleVerify();
    }
  }, [digits]);

  const code = useMemo(() => digits.join("").trim(), [digits]);

  const handleSend = async () => {
    if (!emailOrPhone) {
      setError("Missing email, unable to send verification code");
      return;
    }
    setIsSending(true);
    try {
      // 需要判断是邮箱/手机
      if (mode == "email") {
        await sendCode({ email: emailOrPhone });
      } else {
        await sendPhoneCode({ phoneNumber: emailOrPhone });
      }
      setCountdown(60);
    } catch (e: any) {
      setError(e?.message || "Failed to send verification code");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);

    // ----->非https模式本地调试专用代码<-----
    // if(params.mode){}
    // if (mode == "phone") {
    //   return onVerified?.({
    //     linked_accounts: "data.data.user.linked_accounts", // ⭐ 传递完整的 linked_accounts
    //     username: "test@gmail.com",
    //     balance: 5,
    //     referralCode: "NZ5216",
    //     isClaimed: true,
    //   });
    // }
    // onVerified?.({
    //   linked_accounts: "data.data.user.linked_accounts", // ⭐ 传递完整的 linked_accounts
    //   username: "test@gmail.com",
    //   balance: 5,
    //   referralCode: "NZ5216",
    // });
    // ----->非https模式本地调试专用代码<-----
    try {
      // 邮箱模式
      if (mode == "email") {
        await loginWithCode({ code });
      } else {
        await loginWithPhoneCode({ code });
      }

      await refreshUser();
      const accessToken = await getAccessToken();
      console.log("Access token:", accessToken);

      if (accessToken) {
        await loginToBackend(accessToken);
      }
    } catch (e: any) {
      setError(
        e?.message || "Verification code is incorrect, please try again"
      );
      setDigits(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const onChangeDigit = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const onKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    const next = Array(6)
      .fill("")
      .map((_, i) => text[i] || "");
    setDigits(next);
    const lastIdx = Math.min(text.length, 6) - 1;
    if (lastIdx >= 0) inputsRef.current[lastIdx]?.focus();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
            }}
          />

          <motion.div
            className="flex items-center justify-center"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 36,
              mass: 0.6,
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1301,
            }}
          >
            <div className="mx-auto w376px sm:w460px rd-30px box-border p36px bg-[#262626] text-white bg-[#262626]">
              {/* 邮箱/手机  图标 */}
              <div className="flex justify-center mb-24px">
                {mode == "email" ? (
                  <svg
                    width="47"
                    height="47"
                    viewBox="0 0 47 47"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.22449 15.0797L22.1251 24.7551C22.8911 25.3296 23.9443 25.3296 24.7103 24.7551L37.6109 15.0797M40.006 7.80566H6.82938C5.21265 7.80566 3.90204 9.11628 3.90204 10.733V35.0389C3.90204 36.6556 5.21266 37.9662 6.82939 37.9662H40.006C41.6227 37.9662 42.9334 36.6556 42.9334 35.0389V10.733C42.9334 9.11628 41.6227 7.80566 40.006 7.80566Z"
                      stroke="white"
                      stroke-width="2.92735"
                      stroke-linecap="round"
                    />
                  </svg>
                ) : (
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M44 33.8402V39.8402C44.0023 40.3972 43.8882 40.9485 43.665 41.4589C43.4419 41.9692 43.1146 42.4274 42.7042 42.8039C42.2937 43.1805 41.8092 43.4672 41.2815 43.6456C40.7539 43.8241 40.1947 43.8903 39.64 43.8402C33.4857 43.1715 27.574 41.0685 22.38 37.7002C17.5477 34.6295 13.4507 30.5325 10.38 25.7002C6.99996 20.4826 4.89649 14.5422 4.24 8.36019C4.19002 7.80713 4.25575 7.24971 4.433 6.72344C4.61026 6.19717 4.89515 5.71357 5.26954 5.30344C5.64393 4.8933 6.09961 4.56561 6.60759 4.34124C7.11556 4.11686 7.66468 4.00072 8.22 4.00019H14.22C15.1906 3.99064 16.1316 4.33435 16.8675 4.96726C17.6035 5.60017 18.0842 6.47909 18.22 7.44019C18.4732 9.36033 18.9429 11.2456 19.62 13.0602C19.8891 13.776 19.9473 14.554 19.7878 15.302C19.6283 16.0499 19.2577 16.7364 18.72 17.2802L16.18 19.8202C19.0271 24.8273 23.1729 28.9731 28.18 31.8202L30.72 29.2802C31.2638 28.7425 31.9503 28.3719 32.6982 28.2124C33.4462 28.0529 34.2242 28.1111 34.94 28.3802C36.7545 29.0573 38.6399 29.5269 40.56 29.7802C41.5315 29.9173 42.4188 30.4066 43.0531 31.1552C43.6873 31.9038 44.0243 32.8593 44 33.8402Z"
                      stroke="white"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* 标题 */}
              <h2 className="text-center text-24px sm:text-30px font-bold mb-24px text-white">
                Enter Confirmation Code
              </h2>

              {/* 提示文字 */}
              <p className="text-center text-15px text-[#bcbcbc] leading-relaxed mb-48px">
                Please check
                <span className="font-bold text-white lowercase">
                  &nbsp;{emailOrPhone}&nbsp;
                </span>
                for{" "}
                {mode == "email"
                  ? "an email from privy.io and enter your code below"
                  : "a text from Blitzo and enter your code below"}
                <br />
              </p>

              {/* 6位验证码输入框 */}
              <div className="flex justify-center gap-10px mb-32px">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={d}
                    onChange={(e) => onChangeDigit(i, e.target.value.slice(-1))}
                    onKeyDown={(e) => onKeyDown(i, e)}
                    onPaste={onPaste}
                    inputMode="numeric"
                    maxLength={1}
                    className="w45px h65px sm:w-64px sm:h-72px text-center text-28px font-semibold focus:outline-none transition-colors text-white"
                    style={{
                      border: "2px solid #E0E0E0",
                      borderRadius: "12px",
                    }}
                  />
                ))}
              </div>

              {/* 错误提示 */}
              {error && (
                <p className="text-center text-red-500 text-14px mb-20px">
                  {error}
                </p>
              )}

              {/* 重新发送 */}
              <div className="text-center text-15px text-[#bcbcbc]">
                Didn't get an {mode === "email" ? "email" : "phone code"}?
                <button
                  onClick={handleSend}
                  disabled={isSending || !canResend}
                  className="font-bold text-white hover:text-[#FF731C] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSending
                    ? "Sending..."
                    : canResend
                    ? "Resend codes"
                    : `Resend in ${countdown}s`}
                </button>
              </div>

              {/* 加载状态 */}
              {isVerifying && (
                <p className="text-center text-[#FF731C] text-14px mt-20px">
                  Verifying...
                </p>
              )}

              <div className="flex-center mt37px">
                <img
                  className="w158px "
                  src={require("@/assets/version2/privivy.png")}
                  alt=""
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
