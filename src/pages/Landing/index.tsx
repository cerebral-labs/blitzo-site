import { useEffect, useState } from "react";
import {
  useLoginWithOAuth,
  useLoginWithEmail,
  usePrivy,
} from "@privy-io/react-auth";
import { useNavigate } from "umi";
import { Dialog, DialogContent, Stack } from "@mui/material";
import blitzoTiger from "@/assets/blitzo_tiger.jpg";

export default function Landing() {
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const { getAccessToken, user } = usePrivy();
  const { sendCode, loginWithCode } = useLoginWithEmail();

  const { initOAuth } = useLoginWithOAuth({
    async onComplete(params) {
      console.log("OAuth complete:", params);
      console.log("User data:", params.user);

      // After OAuth login, close dialog and show invite code input
      setLoginDialogOpen(false);
      setIsAuthenticated(true);

      // Get user name from the params (freshly returned user data)
      const userData = params.user;

      // Try different sources for the username
      let displayName = "User";

      if (userData?.google?.name) {
        displayName = userData.google.name;
      } else if (userData?.twitter?.username) {
        displayName = userData.twitter.username;
      } else if (userData?.twitter?.name) {
        displayName = userData.twitter.name;
      } else if (userData?.email?.address) {
        displayName = userData.email.address.split("@")[0];
      }

      console.log("Display name:", displayName);
      setUserName(displayName);
    },
  });

  const handleTryNowClick = () => {
    if (!isAuthenticated) {
      // First click: open login dialog
      setLoginDialogOpen(true);
    } else {
      // After authenticated: verify invite code
      handleVerifyInviteCode();
    }
  };

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

  const handleEmailSubmit = async () => {
    if (!email.trim()) return;
    setIsSendingCode(true);
    try {
      await sendCode({ email });
      setShowEmailVerification(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!verificationCode.trim()) return;
    setIsVerifyingEmail(true);
    try {
      await loginWithCode({ code: verificationCode });
      // After successful email login
      setLoginDialogOpen(false);
      setShowEmailVerification(false);
      setIsAuthenticated(true);
      setUserName(email.split("@")[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  const handleBackToEmail = () => {
    setShowEmailVerification(false);
    setVerificationCode("");
  };

  const handleVerifyInviteCode = async () => {
    if (!inviteCode.trim()) {
      setInviteError("Please enter an invite code");
      return;
    }

    setIsVerifying(true);
    setInviteError("");

    try {
      // Hardcoded invite code validation
      if (inviteCode === "BZMY001") {
        // Success - navigate to early access with invite code in URL
        navigate(`/earlyaccess?invite_code=${inviteCode}`);
      } else {
        setInviteError("Invalid invite code");
      }
    } catch (error) {
      console.error("Error verifying invite code:", error);
      setInviteError("Error verifying invite code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // feat 添加重定向
  // useEffect(() => {
  //   navigate("/spermracing?from=blitzo", { replace: true });
  // }, []);

  return (
    <div className="min-h-100vh bg-black flex flex-col items-center justify-between py-60px px-20px">
      {/* Title */}
      <div className="text-center mt-40px">
        <h1
          className="text-[#FF6100] text-40px sm:text-52px md:text-64px"
          style={{ fontFamily: "Jacquard12-Regular, monospace" }}
        >
          Blitzo
        </h1>
      </div>

      {/* Tiger Image and Button/Input */}
      <div className="flex flex-col items-center gap-40px">
        <div className="w-270px h-270px sm:w-380px sm:h-380px md:w-470px md:h-470px lg:w-550px lg:h-550px overflow-hidden rd-0px relative group cursor-pointer">
          <img
            src={blitzoTiger}
            alt="Blitzo Tiger"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <a
            href="https://x.com/blitzo_xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-45px left-1/2 -translate-x-1/2 flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer z-10"
          >
            <svg
              className="w-32px h-32px sm:w-40px sm:h-40px text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>

        {!isAuthenticated ? (
          <button
            onClick={handleTryNowClick}
            className="bg-black text-[#FF6100] text-20px sm:text-24px font-bold px-60px py-18px rd-50px b-1px b-solid b-[#CC4D00] hover:bg-[#FF6100] hover:text-white hover:b-[#FF6100] transition-all animate-pulse-border"
            style={{ fontFamily: "West_england, serif" }}
          >
            Try Now
          </button>
        ) : (
          <div className="flex flex-col items-center gap-20px w-full max-w-400px">
            <p
              className="text-white text-20px sm:text-24px font-medium mb-10px"
              style={{ fontFamily: "Tomorrow, sans-serif" }}
            >
              Welcome @{userName}!
            </p>
            <p className="text-white text-18px" style={{ fontFamily: "Tomorrow, sans-serif" }}>
              You're on the waitlist!
            </p>
          </div>
        )}
      </div>

      {/* Copyright and Terms */}
      <div className="text-center mt-40px">
        <p
          className="text-[#FF6100] text-16px sm:text-18px mb-8px"
          style={{ fontFamily: "West_england, serif" }}
        >
          © 2025 Blitzo
        </p>
        <a
          href="/terms"
          className="text-gray-500 text-12px sm:text-13px hover:text-gray-400 transition-colors block"
          style={{ fontFamily: "West_england, serif" }}
        >
          Terms of Service
        </a>
      </div>

      {/* Login Dialog */}
      <Dialog
        open={loginDialogOpen}
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: "20px",
              padding: "30px",
              backgroundColor: "#000000",
              border: "1px solid #333",
            },
          },
        }}
      >
        <DialogContent sx={{ padding: 0 }}>
          <Stack spacing={3}>
            <h2
              className="text-28px font-semibold text-center mb-10px text-[#FF6100]"
              style={{ fontFamily: "Jacquard12-Regular, monospace" }}
            >
              Blitzo
            </h2>
            <p
              className="text-center text-white/80 mb-20px text-16px"
              style={{ fontFamily: "Tomorrow, sans-serif" }}
            >
              {showEmailVerification
                ? "Verify your email"
                : "Sign in to continue"}
            </p>

            {showEmailVerification ? (
              <>
                <div className="flex flex-col gap-12px">
                  <p
                    className="text-white/70 text-14px text-center"
                    style={{ fontFamily: "Tomorrow, sans-serif" }}
                  >
                    Enter the 6-digit code sent to {email}
                  </p>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    placeholder="000000"
                    maxLength={6}
                    style={{
                      border: "1px solid #444",
                      borderRadius: "50px",
                      fontFamily: "Tomorrow, sans-serif",
                    }}
                    className="w-full h-56px px-24px text-18px text-center bg-black text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6100] transition-colors tracking-widest"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && verificationCode.length === 6) {
                        handleVerifyEmailCode();
                      }
                    }}
                    autoFocus
                  />
                  <div className="flex gap-12px">
                    <button
                      onClick={handleBackToEmail}
                      style={{
                        borderRadius: "50px",
                        fontFamily: "Tomorrow, sans-serif",
                        border: "1px solid #444",
                      }}
                      className="flex-1 h-48px bg-black text-white text-15px font-medium hover:border-[#FF6100] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleVerifyEmailCode}
                      disabled={
                        verificationCode.length !== 6 || isVerifyingEmail
                      }
                      style={{
                        borderRadius: "50px",
                        fontFamily: "Tomorrow, sans-serif",
                      }}
                      className="flex-1 h-48px bg-[#FF6100] text-white text-15px font-medium hover:bg-[#E8650F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifyingEmail ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleGoogleLogin}
                  style={{
                    border: "1px solid #444",
                    borderRadius: "50px",
                    fontFamily: "Tomorrow, sans-serif",
                  }}
                  className="w-full h-56px bg-black text-white flex items-center justify-center gap-12px hover:bg-[#FF6100] hover:border-[#FF6100] transition-all"
                >
                  <svg className="w-20px h-20px" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-15px font-medium">
                    Continue with Google
                  </span>
                </button>

                <button
                  onClick={handleTwitterLogin}
                  style={{
                    border: "1px solid #444",
                    borderRadius: "50px",
                    fontFamily: "Tomorrow, sans-serif",
                  }}
                  className="w-full h-56px bg-black text-white flex items-center justify-center gap-12px hover:bg-[#FF6100] hover:border-[#FF6100] transition-all"
                >
                  <svg
                    className="w-18px h-18px text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="text-15px font-medium">Continue with X</span>
                </button>

                {/* Divider */}
                <div className="flex items-center my-20px">
                  <div className="flex-1 h-1px bg-[#333]"></div>
                  <span
                    className="px-20px text-white/60 text-14px"
                    style={{ fontFamily: "Tomorrow, sans-serif" }}
                  >
                    OR
                  </span>
                  <div className="flex-1 h-1px bg-[#333]"></div>
                </div>

                {/* Email Input */}
                <div className="flex flex-col gap-12px">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email Address"
                    style={{
                      border: "1px solid #444",
                      borderRadius: "50px",
                      fontFamily: "Tomorrow, sans-serif",
                    }}
                    className="w-full h-56px px-24px text-15px bg-black text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6100] transition-colors"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && email.trim()) {
                        handleEmailSubmit();
                      }
                    }}
                  />
                  <button
                    onClick={handleEmailSubmit}
                    disabled={!email.trim() || isSendingCode}
                    style={{
                      borderRadius: "50px",
                      fontFamily: "Tomorrow, sans-serif",
                    }}
                    className="w-full h-48px bg-[#FF6100] text-white text-15px font-medium hover:bg-[#E8650F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingCode ? "Sending..." : "Submit"}
                  </button>
                </div>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  );
}
