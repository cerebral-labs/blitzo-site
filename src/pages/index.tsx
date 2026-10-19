import { Outlet } from "umi";

// privy
import { PrivyProvider } from "@privy-io/react-auth";
import { appId, clientId } from "@/config/privy.config";

// 埋点
import posthog from "posthog-js";
import { PostHogProvider } from "@posthog/react";

posthog.init("phc_7fCPcrUeacUT0INyOVHxwqFkjiv6WoZyeFftV8cTEFY", {
  api_host: "https://us.i.posthog.com",
});

export default function IndexPage() {
  return (
    // <PostHogProvider client={posthog}>
    //   <PrivyProvider
    //     appId={appId}
    //     clientId={clientId}
    //     config={{
    //       loginMethods: ["google"], // 👈 开启 Google 登录
    //     }}
    //   >
    //     <Outlet></Outlet>
    //   </PrivyProvider>
    // </PostHogProvider>
    <Outlet></Outlet>
  );
}
