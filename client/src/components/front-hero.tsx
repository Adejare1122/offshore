import { Clock, PlusIcon } from "lucide-react";

export default function FrontHero() {
    return (
        <section className="flex flex-col justify-center relative md:min-h-[40rem] overflow-hidden">
            {/* Background Image */}
            <div className="main-hero__image h-full w-full max-h-[calc(100vh-7.125rem)] md:max-h-full overflow-hidden md:overflow-visible relative md:static">
                <div className="image-hero pt-[50%] md:pt-0">
                    <div
                        className="absolute top-0 inset-0 h-full w-full bg-cover bg-no-repeat after:content-[''] after:absolute after:inset-0 after:bg-black/60 after:w-full after:h-full after:block after:z-5"
                        style={{
                            backgroundImage: `url(/assets/images/metro.jpg)`,
                            backgroundPosition: `center 40%`
                        }}
                    />
                </div>
            </div>


            {/* Content */}
            <div className="static md:relative container h-full flex items-center z-10">
                <div className="py-4">
                    <p className="absolute md:static top-0 h-[calc(100vw/2)] md:h-full max-w-[50%] md:max-w-xl left-0 text-2xl md:text-5xl font-semibold md:font-bold leading-tight text-white mb-6 md:block p-4 md:p-0 flex flex-col justify-center">
                        Italian National Offshore
                    </p>

                    <p className="block text-base md:text-lg md:font-semibold md:text-white mb-8 max-w-full md:max-w-[50%] leading-relaxed text-center md:text-left">
                        We do banking differently. We believe that people come first and that
                        everyone deserves a great experience every step of the way - whether it's
                        face to face, over the phone, online or on our app.
                    </p>
                </div>
            </div>
        </section>
    );
}