import { MessageCircle, Calendar, Phone, MapPin, Info, Clock, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function News() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Financial News & Events"
                subtitle="All the latest news from Italian blog "
                backgroundImage="/assets/images/Citadel_AlkemyX_00405_weatlh_kate.jpg"
                navigationTitle="Learn & Plan"
            />

            <section className="py-12 md:py-16 container">
                <div className="">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">
                        News & Events
                    </h2>
                </div>
            </section>

            <div className="container mb-5">
                <iframe src="https://www.tradingview-widget.com/embed-widget/timeline/?market=forex#%7B%22market%22%3A%22forex%22%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22regular%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A830%2C%22utm_source%22%3A%22italiannationaloffshore.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22timeline%22%2C%22page-uri%22%3A%22italiannationaloffshore.com%2Fhome%2Fnews%22%7D" title="timeline TradingView widget" lang="en" className="w-full" style={{ height: '830px' }}></iframe>
            </div>

            {/* Pre-Footer Strip */}
            <FrontPreFooterStrip />
            <FrontFooter />
        </div >
    );
}
