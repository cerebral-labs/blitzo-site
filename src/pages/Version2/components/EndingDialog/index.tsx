import { Dialog, DialogContent } from "@mui/material";
import share from "@/assets/share.png";
import copy from "@/assets/copy.png";

interface EndingDialogProps {
  open: boolean;
  onClose: () => void;
  params: any;
  onVerified?: () => void;
}

export default function EndingDialog({
  open,
  onClose,
  params,
  onVerified,
}: EndingDialogProps) {
  //   const getDisplayName = () => {
  //     if (!params) return "USER";

  //     console.log("params:", params);

  //     // 从后端返回的用户数据中获取 linked_accounts
  //     const linkedAccounts =
  //       params.linked_accounts || params.linkedAccounts || [];

  //     // 找到认证账户
  //     const emailAccount = linkedAccounts.find(
  //       (acc: any) => acc.type === "email"
  //     );
  //     const googleAccount = linkedAccounts.find(
  //       (acc: any) => acc.type === "google_oauth"
  //     );
  //     const twitterAccount = linkedAccounts.find(
  //       (acc: any) => acc.type === "twitter_oauth"
  //     );

  //     // Email 登录：显示 address (邮箱地址)
  //     if (emailAccount) {
  //       return emailAccount.address || emailAccount.email || params.username;
  //     }

  //     // Twitter 登录：显示 name (Twitter 用户名)
  //     if (twitterAccount) {
  //       return twitterAccount.name || twitterAccount.username || params.username;
  //     }

  //     // Google 登录：优先 name，其次 email
  //     if (googleAccount) {
  //       return googleAccount.name || googleAccount.email || params.username;
  //     }

  //     // 兜底：使用 params 中的 username
  //     return params.username || params.name || params.email || "USER";
  //   };

  const getDisplayName = () => {
    return "USER";
  };
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      maxWidth={false}
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxWidth: "none",
          margin: { xs: "20px", sm: "32px" },
        },
      }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "transparent",
          },
        },
      }}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DialogContent
        sx={{ padding: 0, display: "flex", justifyContent: "center" }}
      >
        <div className="w-1100px max-w-90vw h-auto min-h-[60vh] sm:min-h-500px max-h-[80vh] flex flex-col items-center justify-center bg-modalbg rounded-20px px-20px sm:px-60px py-40px sm:py-80px box-border overflow-y-auto">
          {/* 标题 */}
          <div className="w-full flex flex-col items-center">
            <div className="text-20px sm:text-32px font-bold tracking-wide text-white">
              THANKS FOR PLAYING
            </div>
            <div className="mt-8px sm:mt-12px text-20px sm:text-32px font-bold text-[#FF7A2F]">
              @{getDisplayName()}
            </div>
          </div>

          {/* Balance */}
          <div className="w-full flex flex-col items-center mt-80px sm:mt-80px mb-40px sm:mb-100px">
            <div className="text-18px sm:text-24px font-bold text-[#bcbcbc] tracking-wide mb-8px sm:mb-12px">
              YOUR REWARD CODE:
            </div>
            <div className="text-56px sm:text-96px leading-none font-bold text-white">
              {params?.referralCode}
            </div>
          </div>

          {/* Referral Code */}
          <div className="w-full flex flex-col items-center mt-60px sm:mt-0">
            {/* 单行布局：Code框 + Copy按钮 + Share按钮 */}
            <div className="flex items-center gap-12px sm:gap-16px">
              {/* Share按钮 */}
              <button
                className="w-307px sm:w-68px h-52px sm:h-68px bg-[#FF7A2F] hover:bg-[#FF6A14] rounded-52px sm:rounded-52px flex items-center justify-center transition-colors text-26px"
                onClick={() => {
                  const code = params?.referralCode || "5OQXRAJ1H";
                  const text = `Join me with code: ${code}`;
                  if ((navigator as any).share) {
                    (navigator as any).share({ text }).catch(() => {});
                  } else {
                    try {
                      navigator.clipboard.writeText(text);
                    } catch {}
                  }
                }}
                aria-label="Share"
              >
                {/* CLAIM AT LAUNCH */}
                <img
                  className="w150px"
                  src={require("@/assets/version2/jersey15.png")}
                  alt=""
                />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
