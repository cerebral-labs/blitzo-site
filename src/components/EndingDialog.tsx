import { Dialog, DialogContent } from "@mui/material";
import share from "@/assets/share.png";
import copy from "@/assets/copy.png";

interface EndingDialogProps {
    open: boolean;
    onClose: () => void;
    params: any;
    onVerified?: () => void;
}

export default function EndingDialog({ open, onClose, params, onVerified }: EndingDialogProps) {
    const getDisplayName = () => {
        if (!params) return "USER";

        console.log("params:", params);

        // 从后端返回的用户数据中获取 linked_accounts
        const linkedAccounts = params.linked_accounts || params.linkedAccounts || [];

        // 找到认证账户
        const emailAccount = linkedAccounts.find((acc: any) => acc.type === 'email');
        const googleAccount = linkedAccounts.find((acc: any) => acc.type === 'google_oauth');
        const twitterAccount = linkedAccounts.find((acc: any) => acc.type === 'twitter_oauth');

        // Email 登录：显示 address (邮箱地址)
        if (emailAccount) {
            return emailAccount.address || emailAccount.email || params.username;
        }

        // Twitter 登录：显示 name (Twitter 用户名)
        if (twitterAccount) {
            return twitterAccount.name || twitterAccount.username || params.username;
        }

        // Google 登录：优先 name，其次 email
        if (googleAccount) {
            return googleAccount.name || googleAccount.email || params.username;
        }

        // 兜底：使用 params 中的 username
        return params.username || params.name || params.email || "USER";
    };

    return (
        <Dialog
            open={open}
            onClose={() => {}}
            maxWidth={false}
            disableEscapeKeyDown
            PaperProps={{
                sx: {
                    borderRadius: '20px',
                    maxWidth: 'none',
                    margin: { xs: "20px", sm: "32px" },
                }
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: 'transparent',
                    }
                }
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <DialogContent sx={{ padding: 0, display: 'flex', justifyContent: 'center' }}>
                <div className="w-1100px max-w-90vw h-auto min-h-[60vh] sm:min-h-500px max-h-[80vh] flex flex-col items-center justify-center bg-white rounded-20px px-20px sm:px-60px py-40px sm:py-80px box-border overflow-y-auto">
                    {/* 标题 */}
                    <div className="w-full flex flex-col items-center">
                        <div className="text-20px sm:text-32px font-bold tracking-wide text-black">THANKS FOR PLAYING</div>
                        <div className="mt-8px sm:mt-12px text-20px sm:text-32px font-bold text-[#FF7A2F]">@{getDisplayName()}</div>
                    </div>

                    {/* Balance */}
                    <div className="w-full flex flex-col items-center mt-80px sm:mt-80px mb-40px sm:mb-100px">
                        <div className="text-18px sm:text-24px font-bold text-[#C8C8C8] tracking-wide mb-8px sm:mb-12px">STARTING BALANCE:</div>
                        <div className="text-56px sm:text-96px leading-none font-bold text-black">
                            ${(params?.balance ?? 20).toFixed ? (params?.balance ?? 20).toFixed(2) : Number(params?.balance ?? 20).toFixed(2)}
                        </div>
                        <div className="text-12px sm:text-14px text-[#B8B8B8] mt-8px sm:mt-12px">Available at launch</div>
                    </div>

                    {/* Referral Code */}
                    <div className="w-full flex flex-col items-center mt-60px sm:mt-0">
                        <div className="text-14px sm:text-16px font-semibold text-[#B0B0B0] mb-6px sm:mb-8px">My Referral Code</div>
                        <div className="text-12px sm:text-13px text-[#C8C8C8] mb-12px sm:mb-16px">Share with friends to earn rewards at launch</div>

                        {/* 单行布局：Code框 + Copy按钮 + Share按钮 */}
                        <div className="flex items-center gap-12px sm:gap-16px">
                            {/* Referral Code 框 - 包含code和copy按钮 */}
                            <div
                                className="flex items-center justify-between px-16px sm:px-28px h-52px sm:h-68px bg-white rounded-12px sm:rounded-16px"
                                style={{
                                    border: '2px solid #E6E6E6',
                                    minWidth: '200px'
                                }}
                            >
                <span className="text-16px sm:text-20px font-bold tracking-widest text-black select-text">
                  {params?.referralCode || "5OQXRAJ1H"}
                </span>
                                <button
                                    className="ml-12px sm:ml-16px p-4px sm:p-6px hover:bg-gray-50 rounded-8px transition-colors"
                                    onClick={async () => {
                                        const code = params?.referralCode || "5OQXRAJ1H";
                                        try {
                                            await navigator.clipboard.writeText(code);
                                        } catch {}
                                    }}
                                    aria-label="Copy"
                                >
                                    <img src={copy} alt="" className="w-20px sm:w-24px h-20px sm:h-24px" />
                                </button>
                            </div>

                            {/* Share按钮 */}
                            <button
                                className="w-52px sm:w-68px h-52px sm:h-68px bg-[#FF7A2F] hover:bg-[#FF6A14] rounded-12px sm:rounded-14px flex items-center justify-center transition-colors"
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
                                <img src={share} alt="" className="w-20px sm:w-26px h-20px sm:h-26px" />
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}