import { useState } from "react";
import bg from "@/assets/version2/blitzoTiger.png";
import bg2 from "@/assets/version2/gradientBG.png";
import logo from "@/assets/version2/blitzoLogo.png";
import relation from "@/assets/version2/relation.png";
import vector from "@/assets/version2/SRlogo.png";
import coin from "@/assets/version2/coin.png";
import Header from "./components/Header";
import { useNavigate } from "umi";

export default function Version2() {
  const [isStart, setIsStart] = useState(true);

  const navigate = useNavigate();

  const start = () => {
    navigate("/start");
  };

  return (
    <div
      className="w100% h100vh"
      style={{
        backgroundImage: `url(${isStart ? bg : bg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header />

      {/* PC */}
      <div className="hidden md:flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-[#f9f9f9] ">
          <div className="flex items-center justify-center">
            <img src={vector} alt="" />
            <img src={relation} alt="" />
          </div>

          <div className="mt30px text-center">
            <img className="w366px h94px" src={logo} alt="" />
          </div>

          <div className="mt80px flex items-center justify-center">
            <img className="h30px" src={coin} alt="" />
            <span className="underline" onClick={start}>
              START
            </span>
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div className="flex items-center justify-center h-[calc(100vh-80px)] sm:hidden">
        <div className="text-[#f9f9f9] ">
          <div className="mt30px flex-center glow-fire fire-flicker-animation">
            <img className="w147px h39px" src={logo} alt="" />
          </div>

          <p className="flex-center my10px">
            <img src={relation} alt="" />
          </p>
          <div className="flex items-center justify-center">
            <img src={vector} alt="" />
          </div>

          <div
            className="mx-auto mt270px gap-10px flex-center w156px h65px rd-65px bg-[#373737] btn-particle"
            onClick={start}
          >
            <img className="h33px" src={coin} alt="" />
            <span className="neon-text">START</span>
          </div>
        </div>
      </div>
    </div>
  );
}
