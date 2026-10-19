import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { useLoginWithOAuth, usePrivy, useUser } from "@privy-io/react-auth";
import google from "@/assets/google.png";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

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

  const initOAuth = (p) => {};

  // 需要https证书才能放开以下代码  并注释上面一行代码

  // const { initOAuth } = useLoginWithOAuth({
  //   async onComplete(params) {
  //     console.log("OAuth complete:", params);
  //     await refreshUser();
  //     console.log("User after refresh:", user);

  //     try {
  //       const accessToken = await getAccessToken();
  //       console.log("Access token:", accessToken);

  //       if (accessToken) {
  //         await loginToBackend(accessToken);
  //       }
  //     } catch (error) {
  //       console.error("Error getting access token or logging in:", error);
  //     }
  //   },
  // });

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: "30px",
          background: "transparent",
          maxWidth: "780px",
          width: "90vw",
          margin: { xs: "20px", sm: "32px" },
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "transparent",
          },
        },
      }}
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="bg-modalbg rd-30px w-full max-h-[85vh] overflow-y-auto px-26px md:px-40px py-30px md:py-40px relative">
          <div className="hidden sm:flex justify-between mb-30px">
            {/* 返回和关闭按钮 */}
            <button
              className="text-22px text-[#666] hover:text-[#333] transition-colors"
              onClick={onClose}
            >
              <ArrowBackIcon></ArrowBackIcon>
            </button>
            <button
              className="text-22px text-[#666] hover:text-[#333] transition-colors"
              onClick={onClose}
            >
              <CloseIcon></CloseIcon>
            </button>
          </div>

          <div className="px-0 md:px-100px">
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
            <div className="flex items-center my-32px">
              <div className="flex-1 h-1px bg-[#E5E5E5]"></div>
              <span className="px-20px text-[#B4B4B4] text-15px">OR</span>
              <div className="flex-1 h-1px bg-[#E5E5E5]"></div>
            </div>

            {/* 邮箱输入 */}
            <div className="hidden sm:flex justify-center">
              <div className="relative w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  style={{
                    border: "1.5px solid #BCBCBC",
                    borderRadius: "50px",
                  }}
                  className="w-full h-60px pl-45px pr-130px text-15px placeholder:text-[#C4C4C4] focus:outline-none focus:border-[#FF731C] transition-colors "
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleEmailSubmit();
                    }
                  }}
                />
                {/* 邮箱图标 */}
                <svg
                  className="absolute left-18px top-1/2 -translate-y-1/2 w-18px h-18px text-[#fff]"
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
                {/* Submit按钮 */}
                <button
                  onClick={handleEmailSubmit}
                  style={{ borderRadius: "50px" }}
                  className="absolute right-6px top-1/2 -translate-y-1/2 h-48px px-26px bg-[#E8E8E8] text-[#999] text-15px font-medium hover:bg-[#FF731C] hover:text-white transition-colors disabled:cursor-not-allowed btn-particle"
                  disabled={!email}
                >
                  Submit
                </button>
              </div>
            </div>

            {/* 邮箱输入mobile */}
            <div className="block sm:hidden justify-center">
              <div className="w-full relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email Address"
                  style={{
                    border: "1.5px solid #BCBCBC",
                  }}
                  className="w-full h-60px rd-14px pl-45px pr-20px text-15px text-white placeholder:text-[#BCBCBC] focus:outline-none focus:border-[#FF731C] transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleEmailSubmit();
                    }
                  }}
                />
                {/* 邮箱图标 */}
                <svg
                  className="absolute left-18px top-1/2 -translate-y-1/2 w-18px h-18px text-[#fff]"
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

            {/* <div className="flex-center mt37px">
              <img
                className="w158px "
                src={require("@/assets/version2/privivy.png")}
                alt=""
              />
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
