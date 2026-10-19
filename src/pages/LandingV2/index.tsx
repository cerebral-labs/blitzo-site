import { useState } from "react";
import { usePostHog } from "@posthog/react";
import { useNavigate } from "umi";
import relation from "@/assets/version2/relation.png";
import vector from "@/assets/version2/SRlogo.png";
import logo from "@/assets/version2/blitzoLogo.png";
import x from "@/assets/version2/x.png";
import Loading from "./components/Loading";

export default function LandingV2() {
  const posthog = usePostHog();
  const navigate = useNavigate();
  const [showLoading, setShowLoading] = useState(false);

  const handleStart = () => {
    setShowLoading(true);
  };

  return (
    <div
      className="w100% h100vh bg-mobile sm:bg-desktop"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Header */}
      <div
        id="header"
        className="box-border px33px py20px sm:py30px flex items-center justify-between text-[#f9f9f9] fixed top-0 left-0 w-full text-14px z-9999"
      >
        <div className="flex items-center gap-10px box-border">
          <img className="w66px h17px" src={logo} alt="" />
        </div>

        <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={handleStart}
        >
          [LOGIN]
        </div>

        <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={handleStart}
        >
          [SIGNUP]
        </div>

        <div
          className="hidden sm:block hover:opacity-70 transition-opacity duration-300 font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={() => navigate("/terms")}
        >
          [TERMS OF SERVICE]
        </div>

        <div
          className="hidden sm:block hover:opacity-70 transition-opacity duration-300 font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={() => navigate("/privacy")}
        >
          [PRIVACY POLICY]
        </div>

        <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular] cursor-pointer"
          onClick={() => window.open("https://x.com/blitzo_xyz")}
        >
          <img className="w10px h10px" src={x} alt="" />
        </div>
      </div>

      {/* PC */}
      <div className="hidden md:flex items-center justify-center h100%">
        <div className="text-[#f9f9f9] ">
          {/*<div className="flex items-center justify-center">*/}
          {/*  <img src={vector} alt="" />*/}
          {/*</div>*/}

          {/*<div className="flex-center mt11px">*/}
          {/*  <img className="mx10px" src={relation} alt="" />*/}
          {/*</div>*/}

          <div className="h200px"></div>

          <div
            className="mx-auto mt80px gap-10px flex items-center justify-center w178px h79px bg-[#373737B2] rd-100px btn-particle cursor-pointer"
            onClick={handleStart}
          >
            <span className="neon-text text-27px">START</span>
            <img
              className="h24px glow-white"
              src={require("@/assets/version3/arrow_circle_right.png")}
              alt=""
            />
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex items-center justify-center sm:hidden h100%">
        <div className="text-[#f9f9f9] ">
          {/*<p className="flex-center my10px mt150px">*/}
          {/*  <img className="w9px" src={relation} alt="" />*/}
          {/*</p>*/}
          {/*<div className="flex items-center justify-center">*/}
          {/*  <img src={vector} alt="" />*/}
          {/*</div>*/}

          <div
            className="mx-auto mt270px gap-10px flex-center w156px h65px rd-65px bg-[#373737] btn-particle cursor-pointer"
            onClick={handleStart}
          >
            <span className="neon-text text-20px">START</span>
            <img
              className="h24px glow-white"
              src={require("@/assets/version3/arrow_circle_right.png")}
              alt=""
            />
          </div>
        </div>
      </div>

      {/* Loading 动画 */}
      <Loading
        open={showLoading}
        onClose={() => {
          setShowLoading(false);
          navigate("/login");
        }}
      />
    </div>
  );
}
