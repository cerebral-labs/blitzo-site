import { useState } from "react";

import logo from "@/assets/version2/blitzoLogo.png";
import x from "@/assets/version2/x.png";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAction = (action: string) => {
    if (action === "login") {
    } else if (action === "signup") {
    } else if (action === "terms") {
    } else {
    }
    toggleMenu();
  };

  return (
    <div className="box-border px33px py38px  flex gap40px sm:gap220px items-center justify-between text-[#f9f9f9] fixed top-0 left-0 w-full">
      <div className="flex items-center gap-10px box-border ">
        <img className="w66px h17px" src={logo} alt="" />
        {/* H5模式下的箭头指示器 */}
        {/* <div
          onClick={toggleMenu}
          className="block sm:hidden w24px h24px cursor-pointer transition-transform duration-300 flex-center"
          style={{
            transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <KeyboardArrowDownIcon className="text-[#f9f9f9]" />
        </div> */}
      </div>
      {/* 菜单项 - 桌面端显示，移动端通过状态控制 */}
      {/* ${
          //   menuOpen
          //     ? "flex absolute top-40px left-20px bg-black/70 p15px rd-8px flex-col items-start gap-15px z-1000 text-[#f9f9f9]"
          //     : "hidden"
          // }  */}
      <div
        className={`flex-1 justify-between items-center gap-20px text-14px  
         flex sm:static sm:flex-row sm:gap-20px sm:bg-transparent sm:p-0 sm:rd-0`}
      >
        <div className="hover:opacity-70 transition-opacity duration-300 btn-particle" onClick={() => handleAction("login")}>
          [LOGIN]
        </div>
        <div className="hover:opacity-70 transition-opacity duration-300 btn-particle" onClick={() => handleAction("signup")}>
          [SIGNUP]
        </div>
        <div className="hidden sm:block hover:opacity-70 transition-opacity duration-300" onClick={() => handleAction("terms")}>
          [TERMS OF SERVICE]
        </div>
        <div className="hover:opacity-70 transition-opacity duration-300 btn-particle" onClick={() => handleAction("x")}>
          <img className="w10px h10px" src={x} alt="" />
        </div>
      </div>
    </div>
  );
}
