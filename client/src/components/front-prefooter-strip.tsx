import { Mail, Phone, Video, Clock } from "lucide-react";

export default function FrontPreFooterStrip() {
    return (
        <section className="bg-accent text-tertiary">
            <div className="container py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center max-w-[300px] md:max-w-none mx-auto">
                    {/* Routing */}
                    <div className="flex items-center gap-4">
                        <img src="/assets/images/citadel-credit-union-routing-number.svg" className="w-12 h-12 md:w-16 md:h-16 text-white" alt="routing" />
                        <div className="text-tertiary">
                            <div className="font-semibold">Routing #</div>
                            <div className="text-sm">21084429</div>
                        </div>
                    </div>

                    {/* Branch hours */}
                    <div className="flex items-center gap-4">
                        <img src="/assets/images/icoclock.png" className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        <div className="text-tertiary">
                            <div className="font-semibold">Branch Hours</div>
                            <div className="text-sm">Mon - Thurs: 8:30 a.m.-5:00 p.m.</div>
                            <div className="text-sm">Friday: 8:30 a.m.-6:00 p.m.</div>
                            <div className="text-sm">Saturday: 9:00 a.m.-1:00 p.m.</div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4">
                        <img src="/assets/images/call-citadel-credit-union.svg" className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        <div>
                            <a href="mailto:info@italiannationsoffshore.com" className="text-tertiary font-semibold">info@italiannationsoffshore.com</a>
                            <div className="text-sm">Customer Service</div>
                        </div>
                    </div>

                    {/* Video connect */}
                    <div className="flex items-center gap-4">
                        <img src="/assets/images/live-video-call.png" className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        <div>
                            <div className="font-semibold">Video Connect</div>
                            <div className="text-sm">Chat Virtually</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}


