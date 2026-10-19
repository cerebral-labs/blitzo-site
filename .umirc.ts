import { defineConfig } from "umi";
// const pxtovw = require("postcss-px-to-viewport");

export default defineConfig({
  routes: [
    {
      path: "/",
      component: "index",
      routes: [
        {
          path: "/",
          component: "Version4",
        },
      ],
      // routes: [
      //   {
      //     path: "/",
      //     component: "LandingV2",
      //   },
      //   {
      //     path: "/login",
      //     component: "LandingV2/Login",
      //   },
      //   {
      //     path: "/spermracing",
      //     component: "Version3",
      //   },
      //   {
      //     path: "/spermracing/login",
      //     component: "Version3/Start",
      //   },
      //   {
      //     path: "/landingv2",
      //     component: "LandingV2",
      //   },
      //   {
      //     path: "/landingv2/login",
      //     component: "LandingV2/Login",
      //   },
      // ],
    },
    {
      path: "/earlyaccess",
      component: "index",
      routes: [
        {
          path: "/earlyaccess",
          component: "EarlyAccess",
        },
      ],
    },
    {
      path: "/terms",
      component: "index",
      routes: [
        {
          path: "/terms",
          component: "Terms",
        },
      ],
    },
    {
      path: "/privacy",
      component: "index",
      routes: [
        {
          path: "/privacy",
          component: "Privacy",
        },
      ],
    },
    {
      path: "/demo",
      component: "Demo",
    },
    {
      path: "/version2",
      component: "Version2",
    },
    {
      path: "/start",
      component: "Version2/Start",
    },

    {
      path: "/swiper",
      component: "Version2/components/demoswiper",
    },
  ],
  npmClient: "pnpm",
  plugins: [require.resolve("@umijs/plugins/dist/unocss")],
  unocss: {
    watch: ["src/**/*.tsx", "src/**/**/**/*.tsx", "src/**/**/**/**/*.tsx"],
  },
  base: "/",
  publicPath: "/",
  outputPath: "dist",
  // GitHub Pages has no SPA fallback: write an index.html for every route
  exportStatic: {},
  esbuildMinifyIIFE: true,
  jsMinifier: "terser", // 将默认的 'esbuild' 改为 'terser'
  extraPostCSSPlugins: [
    // pxtovw({
    //   viewportWidth: 750, // 设计稿宽度（根据你的设计稿来，比如 375 或 750）
    //   unitPrecision: 6, // 转换后的精度
    //   viewportUnit: "vw", // 转换目标单位
    //   selectorBlackList: ["ignore", "van"], // 忽略的类名
    //   minPixelValue: 1, // 小于 1px 不转换
    //   mediaQuery: false, // 是否转换媒体查询里的 px
    // }),
  ],
});
