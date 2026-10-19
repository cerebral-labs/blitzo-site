import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { useLoginWithOAuth, usePrivy, useUser } from "@privy-io/react-auth";
import google from "@/assets/google.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { AnimatePresence, motion } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface RegistryDialogProps {
  open: boolean;
  onClose: () => void;
  callback?: (userData: any) => void; // ⭐ 改为接收参数
  onEmail?: (e: string) => void;
}

export default function RegistryDialog({
  open,
  onClose,
  callback,
  onEmail,
}: RegistryDialogProps) {
  const { user, refreshUser } = useUser();
  const { getAccessToken } = usePrivy();
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // OAuth处理中状态

  // 从URL获取invite_code
  // const getInviteCodeFromUrl = () => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   return urlParams.get("invite_code") || "";
  // };

  // 调用后端登录接口
  const loginToBackend = async (token: string) => {
    try {
      // const inviteCode = getInviteCodeFromUrl();

      const response = await fetch("https://blitzo.xyz/api/v1/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          game_data: "",
          invite_code: "", //SpermRacing 无invite_code
          token: token,
          ca_code: "SpermRacing",
        }),
      });

      const data = await response.json();
      console.log("Backend login response:", data);

      if (data.code === 0) {
        console.log("Login successful!");
        console.log("User info:", data.data.user);
        console.log("Is first time:", data.data.first);
        console.log("Backend token:", data.data.token);

        // 登录成功后的回调
        // ⭐ 关键修改：登录成功后调用 callback 并传递用户数据
        callback?.({
          linked_accounts: data.data.user.linked_accounts, // ⭐ 传递完整的 linked_accounts
          username: data.data.user.name || data.data.user.email,
          balance: 5, // 或从 data.data 中获取
          referralCode: data.data.user.invite_code,
        });
      } else {
        console.error("Login failed:", data.message);
      }

      return data;
    } catch (error) {
      console.error("Error calling backend login API:", error);
      throw error;
    }
  };

  // const initOAuth = (p) => {};

  // 非hptts 需要https证书才能放开以下代码  并注释上面一行代码

  const { initOAuth } = useLoginWithOAuth({
    async onComplete(params) {
      console.log("OAuth complete:", params);
      setIsProcessing(true); // 开始处理OAuth

      try {
        await refreshUser();
        console.log("User after refresh:", user);

        const accessToken = await getAccessToken();
        console.log("Access token:", accessToken);

        if (accessToken) {
          await loginToBackend(accessToken);
        }
      } catch (error) {
        console.error("Error getting access token or logging in:", error);
        setIsProcessing(false);
      }
    },
  });

  const handleGoogleLogin = async () => {
    try {
      await initOAuth({ provider: "google" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      await initOAuth({ provider: "twitter" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmailSubmit = () => {
    if (email) {
      console.log("Email submitted:", email);
      onEmail?.(email);
    }
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
            <div className="mx-auto w376px  rd-30px box-border p36px pb22px bg-black text-white">
              <div className="flex-center glow-fire fire-flicker-animation">
                <img
                  src={require("@/assets/version3/blitzoLogo.png")}
                  alt="blitzo"
                  className="h35px"
                />
              </div>

              {isProcessing ? (
                // OAuth处理中的加载状态
                <div className="px-0 mt-46px">
                  <div className="flex flex-col items-center justify-center py-40px">
                    {/* Lottie 动画 */}
                    <div className="w-200px h-200px">
                      <DotLottieReact
                        src={require("@/assets/lottie/loading.lottie")}
                        loop
                        autoplay
                      />
                    </div>

                    {/* 文字 */}
                    <p className="text-18px text-white font-medium mt-20px">
                      Processing...
                    </p>
                  </div>
                </div>
              ) : (
                // 正常的登录表单
                <div className="px-0  mt-46px">
                {/* 登录按钮组 */}
                <div className="space-y-20px flex flex-col items-center">
                  {/* Google 登录 */}
                  <button
                    onClick={handleGoogleLogin}
                    style={{
                      border: "1.5px solid #D9D9D9",
                      borderRadius: "50px",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    className="w-full h-60px  text-white flex items-center justify-center gap-10px hover:border-[#FF731C] transition-colors btn-particle"
                  >
                    <img className="w-22px h-22px" src={google} alt="Google" />
                    <span className="text-17px font-medium text-white">
                      Continue With Google
                    </span>
                  </button>

                  {/* Twitter/X 登录 */}
                  <button
                    onClick={handleTwitterLogin}
                    style={{
                      border: "1.5px solid #D9D9D9",
                      borderRadius: "50px",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    className="w-full h-60px  text-white flex items-center justify-center gap-10px hover:border-[#FF731C] transition-colors btn-particle"
                  >
                    <svg
                      className="w-18px h-18px text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="text-17px font-medium text-white">
                      Continue With X
                    </span>
                  </button>
                </div>

                {/* 分隔线 */}
                <div className="flex justify-center items-center my-20px sm:my-32px">
                  {/* <div className="flex-1 h-1px bg-[#E5E5E5]"></div> */}
                  <span className="px-20px text-[#B4B4B4] text-14px">OR</span>
                  {/* <div className="flex-1 h-1px bg-[#E5E5E5]"></div> */}
                </div>

                {/* 邮箱输入 */}
                <div className="justify-center">
                  <div className="w-full flex-center gap-18px b-solid b-white/80 b-1px box-border px23px rd-14px">
                    {/* 邮箱图标 */}
                    <svg
                      className="w-23px h-23px text-[#fff]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email Address"
                      className="w-full h-60px   text-15px text-white placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#FF731C] transition-colors"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleEmailSubmit();
                        }
                      }}
                    />
                  </div>

                  {/* Submit按钮 */}
                  <button
                    onClick={handleEmailSubmit}
                    className="mt20px w-full rd-14px h-48px px-26px bg-[#d6d6d6] text-[#999] text-15px font-medium hover:bg-[#FF731C] hover:text-white transition-colors disabled:cursor-not-allowed btn-particle"
                    disabled={!email}
                  >
                    Submit
                  </button>
                </div>

                <div className="mt24px flex gap-5px">
                  <img
                    className="w14px h14px mt3px"
                    src={require("@/assets/version3/info.png")}
                    alt=""
                  />
                  <div className="text-14px text-white/90">
                    <p>
                      Sign up for Early Access.
                    </p>
                    {/* <p className="text-white/40">[Limited Availability]</p> */}
                  </div>
                </div>

                {/* <div className="mt49px flex-center ">
                  <img
                    className="w158px"
                    src={require("@/assets/version2/privivy.png")}
                    alt=""
                  />
                </div> */}
              </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
