import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import GameCard from "./GameCard.jsx";

export default function GameCarousel({ games }) {
  return (
    <div className="rounded-3xl border border-zinc-900 bg-zinc-950 p-4">
      <Swiper
        spaceBetween={16}
        slidesPerView={1.1}
        breakpoints={{
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3.1 }
        }}
      >
        {games.map((g) => (
          <SwiperSlide key={g.id}>
            <div className="max-w-sm">
              <GameCard game={g} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
