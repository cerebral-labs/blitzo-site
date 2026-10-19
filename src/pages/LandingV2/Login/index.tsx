import { useState } from "react";
import { useNavigate } from "umi";
import logo from "@/assets/version2/blitzoLogo.png";
import x from "@/assets/version2/x.png";
import RegistryDialog from "../components/RegistryDialog";
import VerifyCodeDialog from "../components/VerifyCodeDialog";
import { CDN_PRIFIX } from "@/constant";

export default function LandingV2Login() {
  const navigate = useNavigate();
  const [registryDialogOpen, setRegistryDialogOpen] = useState(true);
  const [verifyCodeDialogOpen, setVerifyCodeDialogOpen] = useState(false);
  const [verifyCodeDialogParams, setVerifyCodeDialogParams] = useState({
    mode: "email",
    data: "",
  });
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleRegistrationSuccess = (userData?: any) => {
    setRegistryDialogOpen(false);
    if (userData) {
      setUserInfo(userData);
    }
    setShowWaitlist(true);
  };

  const handleEmailSubmit = (email: string) => {
    setRegistryDialogOpen(false);
    setVerifyCodeDialogParams({
      mode: "email",
      data: email,
    });
    setVerifyCodeDialogOpen(true);
  };

  const handleVerifySuccess = (userData?: any) => {
    setVerifyCodeDialogOpen(false);
    if (userData) {
      setUserInfo(userData);
    }
    setShowWaitlist(true);
  };

  const getDisplayName = () => {
    if (!userInfo) return "USER";

    const linkedAccounts = userInfo.linked_accounts || userInfo.linkedAccounts || [];
    const emailAccount = linkedAccounts.find((acc: any) => acc.type === "email");
    const googleAccount = linkedAccounts.find((acc: any) => acc.type === "google_oauth");
    const twitterAccount = linkedAccounts.find((acc: any) => acc.type === "twitter_oauth");

    if (emailAccount) {
      return emailAccount.address || emailAccount.email || userInfo.username;
    }
    if (twitterAccount) {
      return twitterAccount.name || twitterAccount.username || userInfo.username;
    }
    if (googleAccount) {
      return googleAccount.name || googleAccount.email || userInfo.username;
    }
    return userInfo.username || userInfo.name || userInfo.email || "USER";
  };

  return (
    <div
      className="w100% h100vh overflow-hidden relative"
      style={{
        backgroundImage: `url(${CDN_PRIFIX + "/gradientBG.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div
        id="header"
        className="box-border px33px py20px sm:py30px flex items-center justify-between text-[#f9f9f9] fixed top-0 left-0 w-full text-14px z-9999"
      >
        <div
          className="flex items-center gap-10px box-border cursor-pointer"
          onClick={() => navigate("/landingv2")}
        >
          <img className="w66px h17px" src={logo} alt="" />
        </div>

        {!userInfo && (
          <div
            className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular] cursor-pointer"
            onClick={() => setRegistryDialogOpen(true)}
          >
            [LOGIN]
          </div>
        )}

        {!userInfo && (
          <div
            className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular] cursor-pointer"
            onClick={() => setRegistryDialogOpen(true)}
          >
            [SIGNUP]
          </div>
        )}

        <div
          className="hidden sm:block hover:opacity-70 transition-opacity duration-300 font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={() => navigate("/terms")}
        >
          [TERMS OF SERVICE]
        </div>

        {userInfo && (
          <div className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular]">
            [{getDisplayName()}]
          </div>
        )}

        {/* <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={() => window.open("https://x.com/blitzo_xyz")}
        >
          <img className="w10px h10px" src={x} alt="" />
        </div> */}
      </div>

      {/* Waitlist 成功提示 */}
      {showWaitlist ? (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="text-center text-[#f9f9f9] px20px">
            <p className="neon-text text-28px sm:text-42px mb20px">
              You are on the waitlist!
            </p>
            <p className="text-white/60 text-16px sm:text-20px">
               You will be notified for early access.
            </p>
          </div>
        </div>
      ) : null}

      {/* 注册弹窗 */}
      <RegistryDialog
        open={registryDialogOpen}
        onClose={() => {
          if (showWaitlist) {
            setRegistryDialogOpen(false);
          } else {
            navigate("/landingv2");
          }
        }}
        callback={handleRegistrationSuccess}
        onEmail={handleEmailSubmit}
      />

      {/* 邮箱验证码弹窗 */}
      <VerifyCodeDialog
        params={verifyCodeDialogParams}
        open={verifyCodeDialogOpen}
        onClose={() => {
          setVerifyCodeDialogOpen(false);
          navigate("/landingv2");
        }}
        onVerified={handleVerifySuccess}
      />
    </div>
  );
}
