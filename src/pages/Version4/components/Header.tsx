import blitzologo_black from "@/assets/version4/blitzologo_black.svg";
import x from "@/assets/version4/x.png";

export default function () {
  return (
    <header
      className="h80px fixed top0 left0 w-full flex items-center justify-between px30px z-999
      bg-white/20 backdrop-blur-12 border-b border-white/20 "
    >
      <img
        src={blitzologo_black}
        alt=""
        onClick={() => window.location.reload()}
      />

      <img src={x} alt="" />
    </header>
  );
}
