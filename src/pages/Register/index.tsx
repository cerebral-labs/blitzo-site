import google from "@/assets/google.png";
import { useLoginWithOAuth, useLoginWithEmail, useUser, usePrivy } from "@privy-io/react-auth";
import { useState } from "react";
import EmailLoginDialog from "@/components/EmailLoginDialog";
import BindSMSDialog from "@/components/BindSMSDialog";

export default function Register() {
  const { user, refreshUser } = useUser();
  const { getAccessToken } = usePrivy();

  const { initOAuth } = useLoginWithOAuth({
    async onComplete(params) {
      console.log(params);
      await refreshUser();
      console.log(user);
      debugger;
    },
  });
  useLoginWithEmail();
  const [open, setOpen] = useState(false);
  const [bindopen, setbindOpen] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      // The user will be redirected to OAuth provider's login page
      await initOAuth({ provider: "google" });
    } catch (err) {
      // Handle errors (network issues, validation errors, etc.)
      console.error(err);
    }
  };

  const handleEmailLogin = () => {
    setOpen(true);
  };

  return (
    <div className="box-border py58px">
      <p className="text-center text-[#FF731C] text-36px">Insert Event Name</p>

      <div className="mx-auto w380px">
        <p className="text-30px">Sign up to claim your offer</p>

        <div className="mx-auto mt54px w267px h60px bg-[#343434] text-white rd-60px flex-center" onClick={handleGoogleLogin}>
          <img className="w22px h22px" src={google} alt="" />
          <span>Continue with Google</span>
        </div>

        <div className="mx-auto mt30px w267px h60px bg-[#343434] text-white rd-60px flex-center" onClick={handleEmailLogin}>
          <span>Continue with Email</span>
        </div>

        <div
          className="mx-auto mt30px w267px h60px bg-[#343434] text-white rd-60px flex-center"
          onClick={() =>
            getAccessToken().then((res) => {
              debugger;
            })
          }
        >
          <span>bind</span>
        </div>
      </div>

      <p className="text-center text-[#FF731C] text-36px" style={{ fontFamily: 'Tomorrow', fontWeight: 700, fontStyle: 'italic' }}>Blitzo.xyz</p>
      <EmailLoginDialog open={open} onClose={() => setOpen(false)} />
      <BindSMSDialog open={bindopen} onClose={() => setbindOpen(false)} />
    </div>
  );
}
