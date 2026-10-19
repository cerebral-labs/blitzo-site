import { Link, Outlet } from "umi";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/store/store";
import { AnimatePresence, motion } from "motion/react";
import "./index.less";
import { useEffect } from "react";
import "amfe-flexible";
// import "@unocss/reset/normalize.css";

// 创建一个全局事件发射器
export const routeAnimationComplete = () => {
  window.dispatchEvent(new Event("routeAnimationComplete"));
};

// 需要用到store在配置这个

// export default function Layout() {
//   return (
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         <AnimatePresence>
//           <Outlet />
//         </AnimatePresence>
//       </PersistGate>
//     </Provider>
//   );
// }

export default function Layout() {
  // useEffect(() => {
  //   // 以1920为基准
  //   function setRem() {
  //     const baseWidth = 1920;
  //     const baseFontSize = 16;
  //     const html = document.documentElement;
  //     html.style.fontSize =
  //       (html.clientWidth / baseWidth) * baseFontSize + "px";
  //   }
  //   window.addEventListener("resize", setRem);
  //   setRem();
  // }, []);

  return (
    <AnimatePresence>
      <Outlet />
    </AnimatePresence>
  );
}
