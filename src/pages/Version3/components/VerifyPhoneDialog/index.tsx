import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface VerifyPhoneDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (fullPhoneE164: string) => void;
  onSkip?: () => void;
}

type CountryOption = {
  label: string;
  dial: string;
  placeholder: string;
  rule: RegExp;
  tip: string; // 添加提示信息
};

const COUNTRY_OPTIONS: CountryOption[] = [
  {
    label: "US",
    dial: "+1",
    placeholder: "(123) 456-7890",
    rule: /^\d{10}$/,
    tip: "Please enter a valid 10-digit US phone number",
  },
  {
    label: "CN",
    dial: "+86",
    placeholder: "138 0013 8000",
    rule: /^1[3-9]\d{9}$/,
    tip: "Please enter a valid 11-digit Chinese phone number starting with 13-19",
  },
  {
    label: "GB",
    dial: "+44",
    placeholder: "07400 123456",
    rule: /^(\d{10}|\d{11})$/,
    tip: "Please enter a valid 10 or 11-digit UK phone number",
  },
  {
    label: "IN",
    dial: "+91",
    placeholder: "98765 43210",
    rule: /^[6-9]\d{9}$/,
    tip: "Please enter a valid 10-digit Indian phone number starting with 6-9",
  },
];

export default function VerifyPhoneDialog({
  open,
  onClose,
  onSubmit,
}: VerifyPhoneDialogProps) {
  const [country, setCountry] = useState<CountryOption>(COUNTRY_OPTIONS[0]);
  const [phone, setPhone] = useState("");

  const [showTip, setShowTip] = useState(false);

  const isValid = useMemo(() => {
    return country.rule.test(phone);
  }, [phone, country]);

  // 获取验证提示信息
  const getValidationTip = () => {
    if (!phone) {
      return "Please enter your phone number";
    }
    if (!isValid) {
      return country.tip;
    }
    return "Phone number format is correct";
  };

  const handleSubmit = () => {
    if (!isValid) return;
    const full = `${country.dial}${phone}`;
    onSubmit?.(full);
  };

  const handlePhoneChange = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    setPhone(numbersOnly);
    // 当用户开始输入时显示提示
    if (numbersOnly && !showTip) {
      setShowTip(true);
    }
  };

  const handleCountryChange = (newCountry: CountryOption) => {
    setCountry(newCountry);
    setPhone("");
    setShowTip(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1300,
            }}
          />

          <motion.div
            className="flex items-center justify-center"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 36,
              mass: 0.6,
            }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1301,
            }}
          >
            <div className="mx-auto w376px rd-30px box-border p36px bg-black text-white">
              {/* Logo */}
              <div className="flex-center glow-fire fire-flicker-animation">
                <img
                  src={require("@/assets/version3/blitzoLogo.png")}
                  alt="blitzo"
                  className="h35px"
                />
              </div>

              {/* 电话图标 */}
              <div className="flex justify-center mt50px mb-16px">
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M44 33.8402V39.8402C44.0023 40.3972 43.8882 40.9485 43.665 41.4589C43.4419 41.9692 43.1146 42.4274 42.7042 42.8039C42.2937 43.1805 41.8092 43.4672 41.2815 43.6456C40.7539 43.8241 40.1947 43.8903 39.64 43.8402C33.4857 43.1715 27.574 41.0685 22.38 37.7002C17.5477 34.6295 13.4507 30.5325 10.38 25.7002C6.99996 20.4826 4.89649 14.5422 4.24 8.36019C4.19002 7.80713 4.25575 7.24971 4.433 6.72344C4.61026 6.19717 4.89515 5.71357 5.26954 5.30344C5.64393 4.8933 6.09961 4.56561 6.60759 4.34124C7.11556 4.11686 7.66468 4.00072 8.22 4.00019H14.22C15.1906 3.99064 16.1316 4.33435 16.8675 4.96726C17.6035 5.60017 18.0842 6.47909 18.22 7.44019C18.4732 9.36033 18.9429 11.2456 19.62 13.0602C19.8891 13.776 19.9473 14.554 19.7878 15.302C19.6283 16.0499 19.2577 16.7364 18.72 17.2802L16.18 19.8202C19.0271 24.8273 23.1729 28.9731 28.18 31.8202L30.72 29.2802C31.2638 28.7425 31.9503 28.3719 32.6982 28.2124C33.4462 28.0529 34.2242 28.1111 34.94 28.3802C36.7545 29.0573 38.6399 29.5269 40.56 29.7802C41.5315 29.9173 42.4188 30.4066 43.0531 31.1552C43.6873 31.9038 44.0243 32.8593 44 33.8402Z"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* 标题 */}
              <h2 className="text-center text-20px mb-39px text-white">
                Verify Your Phone Number
              </h2>

              {/* 输入区域 */}
              <div className="mb-20px">
                <div
                  className="w-full h-60px flex items-center px-10px text-white rd-13px"
                  style={{ border: "1px solid #3E3E3E" }}
                >
                  {/* 国家选择 */}
                  <div className="relative flex-center">
                    <select
                      className="appearance-none bg-transparent text-15px cursor-pointer text-white"
                      value={country.dial}
                      onChange={(e) => {
                        const next =
                          COUNTRY_OPTIONS.find(
                            (c) => c.dial === e.target.value
                          ) || COUNTRY_OPTIONS[0];
                        handleCountryChange(next);
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
                    <KeyboardArrowDownIcon
                      sx={{ fontSize: 16 }}
                    ></KeyboardArrowDownIcon>
                  </div>

                  {/* 分割线 */}
                  <div className="mx-10px h-30px w-1px bg-[#3E3E3E]"></div>

                  {/* 手机号输入 */}
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onFocus={() => setShowTip(true)}
                    placeholder={country.placeholder}
                    className="flex-1 bg-transparent outline-none text-15px text-white placeholder:text-[#BCBCBC]"
                  />
                </div>

                {/* 验证提示 */}
                {(showTip || phone) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="py-2px text-14px transition-colors"
                    style={{
                      color: isValid ? "#10B981" : "#F59E0B", // 绿色表示正确，橙色表示警告
                    }}
                  >
                    {getValidationTip()}
                  </motion.p>
                )}
              </div>

              {/* 提交按钮 */}
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

              {/* 提示信息 */}
              <div className="mt-36px flex gap-5px">
                <img
                  className="w14px h14px mt3px"
                  src={require("@/assets/version3/info.png")}
                  alt=""
                />
                <div className="text-14px text-white/90">
                  Verify your number to secure your spot for exclusive access
                  and claim your ticket
                </div>
              </div>

              {/* 底部 logo */}
              {/* <div className="flex-center mt-113px">
                <img
                  className="w158px"
                  src={require("@/assets/version2/privivy.png")}
                  alt="privivy"
                />
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
