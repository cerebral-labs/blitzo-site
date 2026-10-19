import { useState } from "react";
import { useNavigate } from "umi";

import logo from "@/assets/version2/blitzoLogo.png";
import x from "@/assets/version2/x.png";

export default function Header(props: any) {
  const { user, start } = props;
  const navigate = useNavigate();

  const handleAction = (action: string) => {
    if (action === "terms") {
      return navigate("/terms");
    }
    start();
  };

  const getDisplayName = () => {
    if (!user) return "USER";

    console.log("params:", user);

    // 从后端返回的用户数据中获取 linked_accounts
    const linkedAccounts = user.linked_accounts || user.linkedAccounts || [];

    // 找到认证账户
    const emailAccount = linkedAccounts.find(
      (acc: any) => acc.type === "email"
    );
    const googleAccount = linkedAccounts.find(
      (acc: any) => acc.type === "google_oauth"
    );
    const twitterAccount = linkedAccounts.find(
      (acc: any) => acc.type === "twitter_oauth"
    );

    // Email 登录：显示 address (邮箱地址)
    if (emailAccount) {
      return emailAccount.address || emailAccount.email || user.username;
    }

    // Twitter 登录：显示 name (Twitter 用户名)
    if (twitterAccount) {
      return twitterAccount.name || twitterAccount.username || user.username;
    }

    // Google 登录：优先 name，其次 email
    if (googleAccount) {
      return googleAccount.name || googleAccount.email || user.username;
    }

    // 兜底：使用 params 中的 username
    return user.username || user.name || user.email || "USER";
  };

  return (
    <div
      id="header"
      className="box-border px33px py20px sm:py30px  flex  items-center justify-between text-[#f9f9f9] fixed top-0 left-0 w-full text-14px z-9999"
    >
      <div
        className="flex items-center gap-10px box-border"
        onClick={() => {
          navigate("/spermracing");
        }}
      >
        <img className="w66px h17px" src={logo} alt="" />
      </div>
      {!user && (
        <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular]"
          onClick={() => handleAction("login")}
        >
          [LOGIN]
        </div>
      )}

      {!user && (
        <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular]"
          onClick={() => handleAction("signup")}
        >
          [SIGNUP]
        </div>
      )}
      <div
        className="hidden sm:block hover:opacity-70 transition-opacity duration-300 font-[ABCDiatypeMono-Regular]"
        onClick={() => handleAction("terms")}
      >
        [TERMS OF SERVICE]
      </div>

      {/* 登录后显示username */}
      {user && (
        <div
          className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular]"
          onClick={() => {}}
        >
          [{getDisplayName()}]
        </div>
      )}

      <div
        className="hover:opacity-70 transition-opacity duration-300 btn-particle font-[ABCDiatypeMono-Regular]"
        onClick={() => window.open("https://x.com/blitzo_xyz")}
      >
        <img className="w10px h10px" src={x} alt="" />
      </div>
    </div>
  );
}
