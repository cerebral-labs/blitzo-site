import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { useLoginWithEmail, usePrivy, useUser } from "@privy-io/react-auth";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

import mail from "@/assets/mail.png";

interface VerifyCodeDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onVerified?: (userData: any) => void;  // ⭐ 确保接收参数
  params: any;
}

export default function VerifyCodeDialog({ open, onClose, params, onVerified }: VerifyCodeDialogProps) {
  const { data: email } = params;

  const { sendCode, loginWithCode } = useLoginWithEmail();
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
    const id = setInterval(() => setCountdown((s) => (s > 0 ? s - 1 : 0)), 1000);
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
    if (!email) {
      setError("Missing email, unable to send verification code");
      return;
    }
    setIsSending(true);
    try {
      await sendCode({ email });
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
    try {
      await loginWithCode({ code });
      await refreshUser();

      const accessToken = await getAccessToken();
      console.log("Access token:", accessToken);

      if (accessToken) {
        await loginToBackend(accessToken);
      }
    } catch (e: any) {
      setError(e?.message || "Verification code is incorrect, please try again");
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

  const onKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          width: "780px",
          maxWidth: "90vw",
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="px-0 sm:px30px py-30px">
          {/* 返回和关闭按钮 - 调整位置 */}
          <div className="hidden sm:flex justify-between">
            <button className="text-24px text-[#666] hover:text-[#333] transition-colors cursor-pointer" onClick={onClose}>
              <ArrowBackIcon />
            </button>
            <button className="text-24px text-[#666] hover:text-[#333] transition-colors cursor-pointer" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>

          {/* 邮箱图标 */}
          <div className="flex justify-center mb-24px">
            <img className="w-56px h-56px" src={mail} alt="" />
          </div>

          {/* 标题 */}
          <h2 className="text-center text-24px sm:text-30px font-bold mb-24px">Enter Confirmation Code</h2>

          {/* 提示文字 */}
          <p className="text-center text-15px text-[#666] leading-relaxed mb-48px">
            Please check <span className="font-bold text-black lowercase">{email}</span> for an email
            <br />
            from privy.io and enter your code below
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
                className="w45px h65px sm:w-64px sm:h-72px text-center text-28px font-semibold focus:outline-none transition-colors"
                style={{
                  border: "2px solid #E0E0E0",
                  borderRadius: "12px",
                }}
              />
            ))}
          </div>

          {/* 错误提示 */}
          {error && <p className="text-center text-red-500 text-14px mb-20px">{error}</p>}

          {/* 重新发送 */}
          <div className="text-center text-15px text-[#666]">
            Didn't get an email?{" "}
            <button onClick={handleSend} disabled={isSending || !canResend} className="font-bold text-black hover:text-[#FF731C] transition-colors disabled:opacity-50 cursor-pointer">
              {isSending ? "Sending..." : canResend ? "Resend codes" : `Resend in ${countdown}s`}
            </button>
          </div>

          {/* 加载状态 */}
          {isVerifying && <p className="text-center text-[#FF731C] text-14px mt-20px">Verifying...</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}
