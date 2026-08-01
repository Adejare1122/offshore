
export default function FeatureSection() {
    return (
        <section className="py-12 bg-background">
            <div className="md:container">
                <div className="flex flex-col md:flex-row h-full items-center relative overflow-hidden">

                    {/* Left overlay panel */}
                    <div className="md:absolute left-0 top-0 inset-y-0 -mt-24 md:mt-0 h-full w-[90%] md:w-[42%] flex items-start mx-2 md:mx-auto">
                        <div className="mt-12 bg-white/95 rounded-tl-3xl rounded-br-3xl max-w-[560px] w-full px-5 py-5 md:px-12 md:py-12">
                            <h2 className="font-serif text-lg md:text-[40px] font-semibold text-foreground leading-tight">
                                Get €300* With a Checking
                                <br />
                                Account Built for You
                            </h2>
                            <p className="mt-8 text-[16px] md:text-[17px] leading-[1.9] text-foreground/80">
                                For a limited time, get a €300 when you open any new checking account!
                                <span className="ml-1">*Select "Learn More" to see important offer details.</span>
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-[76%] h-full max-h-[80vh] ml-auto order-first md:order-last">
                        <img src="/assets/images/feature.jpg" alt="300 Cash Back Checking Bonus" className="w-full h-full  object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}