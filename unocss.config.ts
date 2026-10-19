// unocss.config.ts

import { CDN_PRIFIX } from "./src/constant";
import { defineConfig, presetAttributify, presetUno } from "unocss";

export function createConfig({ strict = true, dev = true } = {}) {
  return defineConfig({
    envMode: dev ? "dev" : "build",
    presets: [presetAttributify({ strict }), presetUno()],
    shortcuts: {
      "flex-center": "flex justify-center items-center",
      "flex-between-center": "flex justify-between items-center",
      "flex-none-center": "flex items-center",
      // 发光文字
      "neon-text":
        "font-semibold tracking-[0.08em] [text-shadow:0_0_8px_rgba(249,249,249,0.95),0_0_24px_rgba(249,249,249,0.7),0_0_48px_rgba(249,249,249,0.4)] [filter:drop-shadow(0_0_6px_rgba(249,249,249,0.3))]",
      "neon-text-red":
        "font-semibold tracking-[0.08em] text-[#fff] [text-shadow:0_0_8px_rgba(255,120,120,0.95),0_0_24px_rgba(255,60,60,0.8),0_0_48px_rgba(255,0,0,0.65)] [filter:drop-shadow(0_0_8px_rgba(255,0,0,0.55))]",
      "neon-text-orange":
        "font-semibold tracking-[0.08em] text-[#fff] [text-shadow:0_0_8px_rgba(252,75,25,0.95),0_0_24px_rgba(252,75,25,0.8),0_0_48px_rgba(252,75,25,0.65)] [filter:drop-shadow(0_0_8px_rgba(252,75,25,0.55))]",
    },
    rules: [
      ["card-shadow", { "box-shadow": "2px 3px 4px 0px rgba(0, 0, 0, 0.1)" }],
      [
        "btn-particle",
        {
          overflow: "visible",
          // animation: "particle 0.5s ease-out",
        },
      ],

      [
        "glow-fire",
        {
          // filter:
          //   "drop-shadow(0 0 10px rgba(255, 100, 0, 0.8)) drop-shadow(0 0 20px rgba(255, 50, 0, 0.8)) drop-shadow(0 0 30px rgba(255, 0, 0, 0.6))",
          filter:
            "  drop-shadow(0 0 20px rgba(252, 75, 25, 0.6))  drop-shadow(0 0 30px rgba(252, 75, 25, 0.3))",
          // animation: "fire-flicker 1.5s infinite alternate",
        },
      ],
      [
        "fire-flicker-animation",
        {
          animation: "fire-flicker 1.5s infinite alternate",
        },
      ],
      [
        "glow-white",
        {
          filter:
            "drop-shadow(0 0 10px rgba(255, 255, 255, 0.9)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.7)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))",
          animation: "white-flicker 2s infinite alternate",
        },
      ],

      [
        "bg-desktop",
        { "background-image": `url(${CDN_PRIFIX}/bgwithLogo.png)` },
      ],
      [
        "bg-mobile",
        { "background-image": `url(${CDN_PRIFIX}/bgwithLogoForMobile.png)` },
      ],
    ],
    theme: {
      colors: {
        modalbg: "#262626",
        btncolor: "#373737", // 按钮主颜色
      },
      animation: {
        // blitzo img发光效果
        keyframes: {
          "fire-flicker": `{
            0%, 100% {
              filter: drop-shadow(0 0 10px rgba(255, 100, 0, 0.8))
                      drop-shadow(0 0 20px rgba(255, 50, 0, 0.8))
                      drop-shadow(0 0 30px rgba(255, 0, 0, 0.6));
            }
            50% {
              filter: drop-shadow(0 0 15px rgba(255, 120, 0, 0.9))
                      drop-shadow(0 0 25px rgba(255, 70, 0, 0.9))
                      drop-shadow(0 0 35px rgba(255, 20, 0, 0.7));
            }
          }`,
        },
      },
    },
    // 文字高亮动画
    preflights: [
      {
        getCSS: ({ theme }) => {
          const primaryColor = theme.colors.btncolor; // 从主题获取
          return `
            @keyframes particle {
              0% {
                box-shadow: 
                  0 0 0 0 ${primaryColor}40,
                  0 0 0 0 ${primaryColor}30,
                  0 0 0 0 ${primaryColor}20,
                  0 0 0 0 ${primaryColor}10;
              }
              100% {
                box-shadow: 
                  0 0 0 20px ${primaryColor}00,
                  0 0 0 40px ${primaryColor}00,
                  0 0 0 60px ${primaryColor}00,
                  0 0 0 80px ${primaryColor}00;
              }
            }
            
            .btn-particle:active {
              animation: particle 0.5s ease-out;
            }
          `;
        },
      },
    ],
  });
}

export default createConfig();
