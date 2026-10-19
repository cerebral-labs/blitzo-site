// import { Pagination } from "@mui/material";
// import { EffectCards, Autoplay } from "swiper/modules";
// import { SwiperSlide } from "swiper/react";
// import { Swiper } from "swiper/react";

// export default function S() {
//   return (
//     <Swiper
//       className="w290px h292px"
//       effect="cards"
//       grabCursor
//       modules={[EffectCards, Pagination, Autoplay]}
//       pagination={{ clickable: true }}
//     >
//       {new Array(3).fill({}).map((item) => {
//         return (
//           <SwiperSlide>
//             <div className="w100% h100% rd-24px bg-#f0f0f0/90 p20px box-border shadow-lg">
//               <p className="text-36px font-800 tracking-wide text-#111">
//                 ROLEX
//               </p>
//               <p className="text-22px font-700 mt10px text-#111">$23999.99</p>
//             </div>
//           </SwiperSlide>
//         );
//       })}
//     </Swiper>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

// 幻灯片数据
const slidesData = [
  {
    id: 1,
    title: "ROLEX 1",
    price: "$23,999.99",
    color: "#1e3c72",
    image:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "ROLEX 2",
    price: "$24,599.99",
    color: "#2c3e50",
    image:
      "https://images.unsplash.com/photo-1547996160-81dfd9c4b1b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "ROLEX 3",
    price: "$25,299.99",
    color: "#8e44ad",
    image:
      "https://images.unsplash.com-1526045431048-f857369baa09?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "ROLEX 4",
    price: "$26,499.99",
    color: "#27ae60",
    image:
      "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "ROLEX 5",
    price: "$27,899.99",
    color: "#c0392b",
    image:
      "https://images.unsplash.com/photo-1565448033353-0c41182affa3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
];

const CoverflowCarousel = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // 处理幻灯片变化
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  // 手动切换幻灯片
  const goToSlide = (index) => {
    if (swiperRef.current) {
      swiperRef.current.slideToLoop(index);
    }
  };

  // 下一张
  const nextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  // 上一张
  const prevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  // 切换播放状态
  const togglePlayPause = () => {
    // if (!swiperRef.current) return;
    // if (isPlaying) {
    //   swiperRef.current.autoplay.stop();
    // } else {
    //   swiperRef.current.autoplay.start();
    // }
    // setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-1200px w-100% text-center bg-red">
      <div className="px20px">
        <h1 className="text-[2.8rem] mb-10px [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)] text-white md:text-[2.2rem]">
          无缝轮播图
        </h1>
        <p className="text-[1.2rem] mb-40px opacity-90 text-white">
          Coverflow效果 - 中间激活，左右预览，支持无缝循环
        </p>
      </div>

      <div className="relative w-100% h-400px mx-auto overflow-hidden md:h-350px ">
        <Swiper
          ref={swiperRef}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          loop={true}
          speed={800}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 140,
            modifier: 1,
            scale: 0.81,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          // onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="w-100% h-100% py-20px"
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide
              key={slide.id}
              className="!w-320px transition-all duration-800 ease-in-out md:!w-280px"
            >
              <div
                className="w-100% h-360px rounded-12px overflow-hidden [box-shadow:0_10px_30px_rgba(0,0,0,0.4)] flex flex-col cursor-pointer scale-90 transition-all duration-800 ease-in-out md:h-320px"
                style={{
                  background: `linear-gradient(145deg, ${
                    slide.color
                  }, ${lightenColor(slide.color, 20)})`,
                }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-100% h-200px object-cover [border-bottom:3px_solid_rgba(255,255,255,0.1)]"
                />
                <div className="p-20px flex-1 flex flex-col justify-between text-white">
                  <h3 className="text-[1.8rem] mb-10px">{slide.title}</h3>
                  <p className="text-[1.2rem] opacity-90">{slide.price}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="flex justify-center gap-20px mt-30px">
        <button
          onClick={prevSlide}
          className="bg-[rgba(255,255,255,0.15)] border-2 border-[rgba(255,255,255,0.3)] text-white px-25px py-12px rounded-50px text-base cursor-pointer transition-all duration-300 ease-in-out [backdrop-filter:blur(5px)] hover:bg-[rgba(255,255,255,0.25)] hover:-translate-y-2px"
        >
          上一张
        </button>
        <button
          onClick={togglePlayPause}
          className="bg-[rgba(255,255,255,0.15)] border-2 border-[rgba(255,255,255,0.3)] text-white px-25px py-12px rounded-50px text-base cursor-pointer transition-all duration-300 ease-in-out [backdrop-filter:blur(5px)] hover:bg-[rgba(255,255,255,0.25)] hover:-translate-y-2px"
        >
          {isPlaying ? "暂停" : "播放"}
        </button>
        <button
          onClick={nextSlide}
          className="bg-[rgba(255,255,255,0.15)] border-2 border-[rgba(255,255,255,0.3)] text-white px-25px py-12px rounded-50px text-base cursor-pointer transition-all duration-300 ease-in-out [backdrop-filter:blur(5px)] hover:bg-[rgba(255,255,255,0.25)] hover:-translate-y-2px"
        >
          下一张
        </button>
      </div>

      <div className="flex justify-center gap-12px mt-25px">
        {slidesData.map((_, index) => (
          <div
            key={index}
            className={`w-12px h-12px rounded-full bg-[rgba(255,255,255,0.3)] cursor-pointer transition-all duration-300 ease-in-out ${
              index === activeIndex ? "bg-white scale-[1.3]" : ""
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className="mt-20px text-[1.1rem] opacity-90 text-white">
        当前幻灯片: {activeIndex + 1} / {slidesData.length}
      </div>

      <div className="flex justify-center flex-wrap gap-15px mt-40px">
        <div className="bg-[rgba(255,255,255,0.1)] px-25px py-15px rounded-10px [backdrop-filter:blur(5px)] text-white">
          无缝循环
        </div>
        <div className="bg-[rgba(255,255,255,0.1)] px-25px py-15px rounded-10px [backdrop-filter:blur(5px)] text-white">
          自动播放
        </div>
        <div className="bg-[rgba(255,255,255,0.1)] px-25px py-15px rounded-10px [backdrop-filter:blur(5px)] text-white">
          响应式设计
        </div>
        <div className="bg-[rgba(255,255,255,0.1)] px-25px py-15px rounded-10px [backdrop-filter:blur(5px)] text-white">
          Coverflow 3D效果
        </div>
      </div>
    </div>
  );
};

// 工具函数：颜色变亮
function lightenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

export default CoverflowCarousel;
