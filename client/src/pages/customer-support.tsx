import { MessageCircle, Calendar, Phone, MapPin, Info, Clock, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function CustomerSupport() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="How can we help you today?"
                backgroundImage="/assets/images/citadel-customer-support.jpg"
                navigationTitle="Contact Us"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">Contact Us</h2>
                    <p className="text-base">


                        What's on your mind? There are lots of ways to get in touch with us. Search our FAQs above, or contact us directly, so we can point you in the right direction. Looking for our branch locations? <a href="#" className="text-primary font-semibold">Find our branches and ATM locations here.</a>

                    </p>
                </div>
            </section>

            <section className="">
                <div className="max-w-7xl mx-auto p-12">
                    <h3 className="text-3xl font-semibold text-[#444] mb-10 text-center">Get in Touch With Us</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="flex flex-col items-center justify-center gap-4 group">

                            <img src="/assets/images/get-started-chat.svg" alt="chat" className="w-12 h-12 lg:w-14 lg:h-14 text-white group-hover:scale-105 transition duration-300 ease-in-out" />

                            <p className="text-xl font-semibold text-tertiary">Video Connect</p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4 group">

                            <img src="/assets/images/get-started-email-us.svg" alt="email" className="w-12 h-12 lg:w-14 lg:h-14 text-white group-hover:scale-105 transition duration-300 ease-in-out" />

                            <p className="text-xl font-semibold text-tertiary">Email Us</p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4 group">

                            <img src="/assets/images/get-started-visit-us.svg" alt="chat" className="w-12 h-12 lg:w-14 lg:h-14 text-white group-hover:scale-105 transition duration-300 ease-in-out" />

                            <p className="text-xl font-semibold text-tertiary">Schedule Appointment</p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4 group">

                            <img src="/assets/images/get-started-call-us.svg" alt="chat" className="w-12 h-12 lg:w-14 lg:h-14 text-white group-hover:scale-105 transition duration-300 ease-in-out" />

                            <p className="text-xl font-semibold text-tertiary">Call Us</p>
                        </div>

                    </div>
                </div>
            </section>


            {/* You Might Also Like Section */}
            <section className="bg-[#f7f7f7]">
                <div className="py-16 container">
                    <div className="bg-white shadow-lg p-4 md:p-6">
                        <h3 className="text-primary text-2xl mb-4">Frequently Searched</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-5">
                            <a href="#" className="inline-flex justify-center text-center font-semibold gap-2 items-center bg-[#eff3f7] text-tertiary hover:bg-tertiary hover:text-white px-6 py-4 w-full">"payment"</a>

                            <a href="#" className="inline-flex justify-center text-center font-semibold gap-2 items-center bg-[#eff3f7] text-tertiary hover:bg-tertiary hover:text-white px-6 py-4 w-full">"secure access code"</a>

                            <a href="#" className="inline-flex justify-center text-center font-semibold gap-2 items-center bg-[#eff3f7] text-tertiary hover:bg-tertiary hover:text-white px-6 py-4 w-full">"mobile banking"</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pre-Footer Strip */}
            <FrontPreFooterStrip />
            <FrontFooter />
        </div>
    );
}
