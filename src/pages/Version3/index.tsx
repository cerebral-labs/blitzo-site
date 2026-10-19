import { useEffect, useState } from "react";
import { usePostHog } from "@posthog/react";

import bg from "@/assets/version2/blitzoTiger.png";
import relation from "@/assets/version2/relation.png";
import vector from "@/assets/version2/SRlogo.png";
import Header from "./components/Header";
import { useNavigate } from "umi";
import Loading from "@/pages/Version3/components/Loading";

export default function Version3() {
  const posthog = usePostHog();

  const [showLoading, setShowLoading] = useState(false); // loading动画

  const navigate = useNavigate();

  const start = () => {
    setShowLoading(true);
  };

  // useEffect(() => {
  //   posthog?.identify("test", {
  //     email: "test@gmail.com",
  //   });
  // }, []);

  return (
    <div
      className="w100% h100vh bg-mobile sm:bg-desktop"
      style={{
        // backgroundImage: `url(${CDN_PRIFIX + "/blitzoTiger.png"})`,
        // backgroundImage: `url(${CDN_PRIFIX + "/bgwithLogo.png.png"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header start={start} />

      {/* PC */}
      <div className="hidden md:flex items-center justify-center h100%">
        <div className="text-[#f9f9f9] ">
          <div className="flex items-center justify-center">
            <img src={vector} alt="" />
          </div>

          <div className="flex-center mt11px">
            <img className="mx10px" src={relation} alt="" />
          </div>

          {/* <div className="mt30px text-center glow-fire ">
            <img className="w366px h94px" src={logo} alt="" />
          </div> */}

          <div className="h200px"></div>

          <div
            className="mx-auto mt80px gap-10px flex items-center justify-center w178px h79px bg-[#373737B2] rd-100px btn-particle"
            onClick={start}
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
          {/* <div className="mt30px flex-center glow-fire ">
            <img className="w147px h39px" src={logo} alt="" />
          </div> */}

          <p className="flex-center my10px mt150px">
            <img className="w9px" src={relation} alt="" />
          </p>
          <div className="flex items-center justify-center">
            <img src={vector} alt="" />
          </div>

          <div
            className="mx-auto mt270px gap-10px flex-center w156px h65px rd-65px bg-[#373737] btn-particle"
            onClick={start}
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

      <Loading
        open={showLoading}
        onClose={() => {
          setShowLoading(false);
          navigate("/spermracing/login");
        }}
      />
    </div>
  );
}
