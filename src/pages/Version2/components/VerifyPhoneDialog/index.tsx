import { useMemo, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

interface VerifyPhoneDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (fullPhoneE164: string) => void;
  onSkip?: () => void;
}

type CountryOption = {
  label: string; // e.g. US
  dial: string; // e.g. +1
  placeholder: string;
};

const COUNTRY_OPTIONS: CountryOption[] = [
  { label: "US", dial: "+1", placeholder: "(123) 456-7891" },
  { label: "CN", dial: "+86", placeholder: "138 0013 8000" },
  { label: "GB", dial: "+44", placeholder: "07400 123456" },
  { label: "IN", dial: "+91", placeholder: "98765 43210" },
];

export default function VerifyPhoneDialog({
  open,
  onClose,
  onSubmit,
  onSkip,
}: VerifyPhoneDialogProps) {
  const [country, setCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [phone, setPhone] = useState("");

  const isValid = useMemo(() => {
    // 简单校验：7-14 位数字
    return /^\d{7,14}$/.test(phone);
  }, [phone]);

  const handleSubmit = () => {
    if (!isValid) return;
    const full = `${country.dial}${phone}`;
    onSubmit?.(full);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          maxWidth: "780px",
          width: "90vw",
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
    >
      <DialogContent sx={{ padding: 0 }}>
        <div className="bg-[#262626] rd-20px w-full max-h-[85vh] overflow-y-auto px-26px md:px-40px py-30px md:py-40px relative">
          <div className="hidden sm:flex justify-between mb-30px">
            <button
              className="text-22px text-[#666] hover:text-[#333] transition-colors"
              onClick={onClose}
            >
              <ArrowBackIcon></ArrowBackIcon>
            </button>
            <button
              className="text-22px text-[#666] hover:text-[#333] transition-colors"
              onClick={onClose}
            >
              <CloseIcon></CloseIcon>
            </button>
          </div>

          {/* 顶部电话图标 */}
          <div className="flex justify-center mb-16px">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44 33.8402V39.8402C44.0023 40.3972 43.8882 40.9485 43.665 41.4589C43.4419 41.9692 43.1146 42.4274 42.7042 42.8039C42.2937 43.1805 41.8092 43.4672 41.2815 43.6456C40.7539 43.8241 40.1947 43.8903 39.64 43.8402C33.4857 43.1715 27.574 41.0685 22.38 37.7002C17.5477 34.6295 13.4507 30.5325 10.38 25.7002C6.99996 20.4826 4.89649 14.5422 4.24 8.36019C4.19002 7.80713 4.25575 7.24971 4.433 6.72344C4.61026 6.19717 4.89515 5.71357 5.26954 5.30344C5.64393 4.8933 6.09961 4.56561 6.60759 4.34124C7.11556 4.11686 7.66468 4.00072 8.22 4.00019H14.22C15.1906 3.99064 16.1316 4.33435 16.8675 4.96726C17.6035 5.60017 18.0842 6.47909 18.22 7.44019C18.4732 9.36033 18.9429 11.2456 19.62 13.0602C19.8891 13.776 19.9473 14.554 19.7878 15.302C19.6283 16.0499 19.2577 16.7364 18.72 17.2802L16.18 19.8202C19.0271 24.8273 23.1729 28.9731 28.18 31.8202L30.72 29.2802C31.2638 28.7425 31.9503 28.3719 32.6982 28.2124C33.4462 28.0529 34.2242 28.1111 34.94 28.3802C36.7545 29.0573 38.6399 29.5269 40.56 29.7802C41.5315 29.9173 42.4188 30.4066 43.0531 31.1552C43.6873 31.9038 44.0243 32.8593 44 33.8402Z"
                stroke="white"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          {/* 标题 */}
          <h2 className="text-center text-22px sm:text-24px font-bold mb-16px text-white">
            Verify Your Phone Number
          </h2>

          {/* 输入区域 - 桌面 */}
          <div className="hidden sm:flex items-center justify-center mb-20px">
            <div
              className="w-full max-w-[520px] h-60px flex items-center px-10px text-white rd-13px"
              style={{ border: "1px solid #3E3E3E" }}
            >
              {/* 国家选择 */}
              <div className="relative">
                <select
                  className="appearance-none bg-transparent pr-26px text-15px cursor-pointer"
                  value={country.dial}
                  onChange={(e) => {
                    const next =
                      COUNTRY_OPTIONS.find((c) => c.dial === e.target.value) ||
                      COUNTRY_OPTIONS[0];
                    setCountry(next);
                  }}
                >
                  {COUNTRY_OPTIONS.map((opt) => (
                    <option
                      className="bg-[#262626]"
                      key={opt.dial}
                      value={opt.dial}
                    >
                      {opt.label} {opt.dial}
                    </option>
                  ))}
                </select>
                <span className="absolute right-8px top-1/2 -translate-y-1/2 text-[#bcbcbc]">
                  ▾
                </span>
              </div>

              {/* 分割 */}
              <div className="mx-10px h-30px w-1px bg-[#3E3E3E]"></div>

              {/* 手机号 */}
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder={country.placeholder}
                className="flex-1 bg-transparent outline-none text-15px placeholder:text-[#BCBCBC]"
              />
            </div>
          </div>

          {/* 输入区域 - 移动端 */}
          <div className="sm:hidden mb-20px">
            <div
              className="flex gap-10px items-center rd-14px "
              style={{ border: "1px solid #3E3E3E" }}
            >
              <div className="flex items-center justify-between px-10px h-52px flex-shrink-0 text-white">
                <select
                  className="appearance-none bg-transparent w-full cursor-pointer text-white"
                  value={country.dial}
                  onChange={(e) => {
                    const next =
                      COUNTRY_OPTIONS.find((c) => c.dial === e.target.value) ||
                      COUNTRY_OPTIONS[0];
                    setCountry(next);
                  }}
                >
                  {COUNTRY_OPTIONS.map((opt) => (
                    <option
                      className="bg-[#262626] text-white"
                      key={opt.dial}
                      value={opt.dial}
                    >
                      {opt.label} {opt.dial}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder={country.placeholder}
                className="flex-1 h-52px rd-14px px-12px bg-transparent text-white placeholder:text-[#BCBCBC]"
              />
            </div>
          </div>

          {/* 提交按钮 - 桌面 */}
          <div className="hidden sm:block">
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full h-60px rd-14px text-16px font-medium transition-colors disabled:cursor-not-allowed"
              style={{
                background: isValid ? "#FF731C" : "#E8E8E8",
                color: isValid ? "#fff" : "#999",
              }}
            >
              Submit
            </button>
          </div>

          {/* 提交按钮 - 移动端 */}
          <div className="sm:hidden">
            <button
              onClick={handleSubmit}
              disabled={!isValid}
              className="w-full h-48px rd-14px text-15px font-medium transition-colors disabled:cursor-not-allowed"
              style={{
                background: isValid ? "#FF731C" : "#d6d6d6",
                color: isValid ? "#fff" : "#999",
              }}
            >
              Submit
            </button>
          </div>

          {/* Skip */}
          <div className="mt-16px text-center">
            <button
              onClick={onSkip}
              className="text-14px text-[#bcbcbc] hover:text-white transition-colors cursor-pointer"
            >
              Skip
            </button>
          </div>

          {/* 底部 logo */}
          <div className="flex-center mt37px">
            <img
              className="w158px "
              src={require("@/assets/version2/privivy.png")}
              alt=""
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
