import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

//img
import bg from "@/assets/version2/blitzoTiger.png";
import iphone from "@/assets/version2/iphone.png";
import bg2 from "@/assets/version2/gradientBG.png";
import coin from "@/assets/version2/coin.png";
import blitzoLogo3 from "@/assets/version2/blitzoLogo3.png";

//components
import Header from "../components/Header";
import Loading from "@/pages/Version2/components/Loading";
import ActionSheet from "../components/ActionSheet";
import RegistryDialog from "../components/RegistryDialog";
import VerifyCodeDialog from "../components/VerifyCodeDialog";
import VerifyPhoneDialog from "../components/VerifyPhoneDialog";
import EndingDialog from "../components/EndingDialog";

export default function Version2() {
  const [showLoading, setShowLoading] = useState(true); // loading动画

  const [showAction, setShowAction] = useState(false); // 开始弹窗
  const [registryDialogOpen, setRegitryDialogOpen] = useState(false);
  const [VerifyCodeDialogOpen, setVerifyCodeDialogOpen] = useState(false);
  const [VerifyCodeDialogParams, setVerifyCodeDialogParams] = useState({
    mode: "email",
    data: "",
  });

  const [VerifyPhoneDialogOpen, setVerifyPhoneDialogOpen] = useState(false); //手机验证弹窗

  const [EndingDialogOpen, setEndingDialogOpen] = useState(false);
  const [EndingDialogParams, setEndingDialogParams] = useState(null); // ⭐ 添加参数状态

  const swiperRef = useRef<SwiperType | null>(null);

  const start = () => {
    setShowAction(true);
  };

  const slidesData = [
    {
      id: 1,
      title: "ROLEX 1",
      price: "$23,999.99",
      color: "#1e3c72",
      image: require("@/assets/version2/swiper1.png"),
    },
    {
      id: 2,
      title: "ROLEX 2",
      price: "$24,599.99",
      color: "#2c3e50",
      image: require("@/assets/version2/swiper2.png"),
    },
    {
      id: 3,
      title: "ROLEX 3",
      price: "$25,299.99",
      color: "#8e44ad",
      image: require("@/assets/version2/swiper3.png"),
    },
    {
      id: 4,
      title: "ROLEX 4",
      price: "$26,499.99",
      color: "#27ae60",
      image: require("@/assets/version2/swiper4.png"),
    },
    {
      id: 5,
      title: "ROLEX 5",
      price: "$27,899.99",
      color: "#c0392b",
      image: require("@/assets/version2/swiper5.png"),
    },
  ];

  return (
    <div
      className="w100% h100vh overflow-hidden relative"
      style={{
        backgroundImage: `url(${bg2})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* 导航栏 */}
      <Header />

      <div className="h70px"></div>

      <div className="absolute" style={{ bottom: "40px" }}>
        <img style={{ height: 120 }} src={blitzoLogo3} alt="" />
      </div>

      {/* PC ---------------------------------------------------------------------------------------*/}
      <div className="hidden sm:block">
        <div className="absolute top-388px left-408px">
          <p className="text-22px  neon-text text-[#f9f9f9]">CHOOSE YOUR</p>
          <p className="text-22px  neon-text text-[#f9f9f9]">WELCOME GIFT</p>
          <div className="w328px h135px b-l-1px b-b-1px  b-solid b-l-[#f9f9f9] b-b-[#f9f9f9]"></div>
        </div>

        <div
          className="w637px h865px absolute left-786px bottom-0 overflow-hidden box-border py20px px25px pb0 "
          style={{
            backgroundImage: `url(${iphone})`,
            backgroundSize: "100% 100%",
          }}
        >
          <div className="bg-black w-full h-full rd-50px"></div>
        </div>
      </div>

      {/* MOBILE -------------------------------------------------------------------------*/}
      <div className="flex justify-center sm:hidden ">
        <div className="text-[#f9f9f9] w-full max-w-full">
          <p className="text-22px text-center my10px neon-text">CHOOSE YOUR</p>
          <p className="text-22px text-center my10px neon-text">WELCOME GIFT</p>

          <div className="relative w-full h-290px mt50px mx-auto overflow-hidden">
            <Swiper
              ref={swiperRef}
              effect="coverflow"
              grabCursor={true}
              centeredSlides={true}
              slidesPerView="auto"
              spaceBetween={14}
              loop={true}
              speed={800}
              modules={[EffectCoverflow, Autoplay]}
              coverflowEffect={{
                rotate: 0,
                stretch: 0,
                depth: 140,
                modifier: 1,
                scale: 0.81,
                slideShadows: false,
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              onSwiper={(swiper: SwiperType) => {
                swiperRef.current = swiper;
              }}
              className="w-full h-full "
            >
              {slidesData.map((item, idx) => {
                return (
                  <SwiperSlide className="!w290px" key={item.id}>
                    <div
                      className="w-full h292px rd-7px box-border shadow-lg overflow-hidden"
                      onClick={() => {
                        const instance = swiperRef.current;
                        if (!instance || !instance.autoplay) return;
                        if (instance.autoplay.running) {
                          instance.autoplay.stop();
                        } else {
                          instance.autoplay.start();
                        }
                      }}
                    >
                      {/* 如果从后台获取可以用以下代码 */}
                      {/* <p className="text-36px font-800 tracking-wide text-#111">ROLEX{idx + 1}</p>
                      <p className="text-22px font-700 mt10px text-#111">$23999.99</p>
                      <img className="w100% h260px rd-16px object-cover mt18px" src={item.image} alt="watch" /> */}

                      <img
                        className="w100% h-full rd-16px object-cover"
                        src={item.image}
                        alt="img"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <div className="mx-auto mt50px flex gap-10px items-center justify-center w261px h65px rd-65px bg-btncolor btn-particle ">
            <img className="w40px h40px" src={coin} alt="" />
            <span className="text-14px neon-text" onClick={start}>
              PLAY DOUBLE OR FREE
            </span>
          </div>

          {/* 操作弹窗 */}
          <ActionSheet
            open={showAction}
            onClose={() => setShowAction(false)}
            onFlip={() => {
              // 这里可以触发你的翻转动画/逻辑
              setShowAction(false);
              setRegitryDialogOpen(true);
            }}
          />
        </div>
      </div>

      {/* loading动画 */}
      <Loading open={showLoading} onClose={() => setShowLoading(false)} />

      {/* 注册阶段 */}
      <RegistryDialog
        open={registryDialogOpen}
        onClose={() => setRegitryDialogOpen(false)}
        onEmail={(data) => {
          setRegitryDialogOpen(false);
          setVerifyCodeDialogParams({
            mode: "email",
            data,
          });
          setVerifyCodeDialogOpen(true);
        }}
        callback={(userData) => {
          // setRegitryDialogOpen(false);
          // setEndingDialogParams(userData);
          // setEndingDialogOpen(true);
        }}
      />

      {/* 邮箱验证码阶段 */}
      <VerifyCodeDialog
        params={VerifyCodeDialogParams}
        open={VerifyCodeDialogOpen}
        onClose={() => setVerifyCodeDialogOpen(false)}
        // ⭐ 添加 onVerified 处理邮箱验证成功
        onVerified={(userData) => {
          setVerifyCodeDialogOpen(false);
          setEndingDialogParams(userData);
          /* 手机号认证阶段---暂时忽略 */
          // if (VerifyCodeDialogParams.mode == "email") {
          //   console.log(VerifyCodeDialogParams);
          //   return setVerifyPhoneDialogOpen(true);
          // }
          return setEndingDialogOpen(true);
        }}
      />

      {/* 手机号认证阶段---暂时忽略 */}
      {/* <VerifyPhoneDialog
          open={VerifyPhoneDialogOpen}
          onClose={() => setVerifyPhoneDialogOpen(false)}
          onSkip={() => {
            setEndingDialogOpen(true);
          }}
          onSubmit={(data) => {
            setVerifyCodeDialogParams({
              mode: "phone",
              data,
            });
            setVerifyCodeDialogOpen(true);
          }}
        ></VerifyPhoneDialog> */}
      {/* 邀请码弹窗 */}
      <EndingDialog
        open={EndingDialogOpen}
        onClose={() => {}} // ⭐ 改为空函数，阻止关闭
        params={EndingDialogParams} // ⭐ 传递参数
      />
    </div>
  );
}
