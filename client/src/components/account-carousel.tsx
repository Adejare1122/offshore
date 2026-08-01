import { Account } from "@shared/schema";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface AccountCarouselProps {
  accounts: Account[];
}

export function AccountCarousel({ accounts }: AccountCarouselProps) {
  const formatBalance = (balance: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(balance));
  };

  const maskAccountNumber = (accountNumber: string) => {
    if (!accountNumber) return '• • • •   • • • •';
    const last4Spaced = accountNumber.slice(-4).split('').join(' ');
    return `• • • •   ${last4Spaced}`;
  };

  if (accounts.length === 0) {
    return (
      <section className="bg-primary pt-4 pb-8">
        <div className="px-4">
          <div className="carousel-container overflow-x-auto hide-scrollbar">
            <div className="flex space-x-4 pb-2">
              <div className="carousel-item flex-none w-80 lg:w-96">
                <div className="card-gradient rounded-2xl p-6 text-white shadow-lg">
                  <div className="text-center py-8">
                    <p className="text-white/80">No accounts available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-primary pt-4 pb-8">
      <div className="px-4">
        <Swiper
          pagination={{ clickable: true }}
          spaceBetween={16}
          slidesPerView={1.1}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 16 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 2.2, spaceBetween: 20 },
            1280: { slidesPerView: 2.1, spaceBetween: 24 },
          }}
        >
          {accounts.map((account) => (
            <SwiperSlide key={account.id}>
              <div className="rounded-xl p-6 text-white border border-accent bg-gradient-to-b from-primary to-primary-dark">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="uppercase text-xs md:text-sm font-medium tracking-wide text-white/60">{account.accountType}</h3>
                    <p className="text-2xl md:text-3xl font-bold mt-2">{formatBalance(account.balance)}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs md:text-sm font-medium tracking-widest uppercase text-white/60 mb-1">Account Number</p>
                  <p className="font-semibold text-lg">{maskAccountNumber(account.accountNumber)}</p>
                </div>
                <div className="w-4/5 md:w-1/3">
                  <div className="grid grid-cols-2 gap-2 md:gap-6 text-sm max-w-sm">
                    <div>
                      <p className="uppercase text-xs md:text-sm font-medium tracking-wider text-white/80">Total Credit</p>
                      <p className="text-[10px] text-white/70 mb-1">
                        {new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
                      </p>
                      <p className="font-semibold">{formatBalance(account.totalCredit)}</p>
                    </div>
                    <div>
                      <p className="uppercase text-xs md:text-sm font-medium tracking-wider text-white/80">Total Debit</p>
                      <p className="text-[10px] text-white/70 mb-1">
                        {new Date().toLocaleString("en-US", { month: "short", year: "numeric" })}
                      </p>
                      <p className="font-semibold">{formatBalance(account.totalDebit)}</p>
                    </div>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
