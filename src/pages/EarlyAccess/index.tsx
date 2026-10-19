import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "umi";
import Home from "../Home";

export default function EarlyAccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isValidated, setIsValidated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const inviteCode = searchParams.get("invite_code");

    // Check if user has valid invite code in URL or session
    const sessionInviteCode = sessionStorage.getItem("blitzo_invite_code");

    if (inviteCode) {
      // Store invite code in session
      sessionStorage.setItem("blitzo_invite_code", inviteCode);
      setIsValidated(true);
      setIsChecking(false);
    } else if (sessionInviteCode) {
      // User has previously validated invite code
      setIsValidated(true);
      setIsChecking(false);
    } else {
      // No invite code found
      setIsValidated(false);
      setIsChecking(false);
    }
  }, [searchParams]);

  if (isChecking) {
    return (
      <div className="min-h-100vh bg-black flex items-center justify-center">
        <div className="text-white text-20px">Loading...</div>
      </div>
    );
  }

  if (!isValidated) {
    return (
      <div className="min-h-100vh bg-black flex flex-col items-center justify-center px-20px">
        <div className="text-center max-w-500px">
          <h1
            className="text-[#FF6100] text-48px sm:text-64px mb-30px"
            style={{ fontFamily: 'Jacquard12-Regular, monospace' }}
          >
            Blitzo
          </h1>
          <h2 className="text-white text-24px sm:text-32px mb-20px font-bold">
            Invite Code Required
          </h2>
          <p className="text-white/80 text-16px sm:text-18px mb-40px">
            You need a valid invite code to access this page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#FF731C] text-white text-18px font-bold px-50px py-16px rd-50px hover:bg-[#E8650F] transition-colors"
            style={{ fontFamily: 'Tomorrow, sans-serif' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <Home />;
}
