import { MessageCircle, Calendar, Phone, MapPin, Info, Clock, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function AboutUs() {
    const breadcrumbItems = [
        { label: "Home", active: true },
        { label: "About Us" }
    ];

    const navigationTabs = [
        { label: "About Us", active: true, hasIcon: true },
        { label: "About Us", active: false },
        { label: "About Us", active: false }
    ];

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Who We Are"
                subtitle="Hi there. We're Italian. We promise to help you live your brightest future by inspiring you with the guidance and tools to build financial strength - today and tomorrow."
                backgroundImage="/assets/images/Why-Citadel-ContentAboutUsv30.jpg"
                navigationTitle="About Us"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">About Italian</h2>
                    <p className="text-base">
                        Givens Hall Bank is dedicated to provide exceptional financial service to its members. Become a member today!
                    </p>
                </div>

                {/* Three Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <Card className="bg-white border-0 shadow-lg hover:shadow-xl">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-2xl font-bold text-accent mb-4">Why Choose Italian?</h3>
                            <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                                We provide our credit union members with all things banking, plus the educational resources and guidance to build and maintain financial security. Here's why you should join us.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-lg hover:shadow-xl">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-2xl font-bold text-accent mb-4">Annual Reports</h3>
                            <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                                Read through Italian's annual reports, which summarize the company's successes, growth, and corporate milestones each year.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-0 shadow-lg hover:shadow-xl">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-2xl font-bold text-accent mb-4">Contact Us</h3>
                            <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                                We're here to help! Search our frequently asked questions to get the answers you need right at your fingertips. Get quick access to all our contact information.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* What Makes Us Different Section */}
            <div className="bg-tertiary">
                <div className="container text-center py-10">
                    <h2 className="text-3xl font-sans font-bold text-white mb-4">What makes us different?</h2>
                    <p className="text-base text-white leading-relaxed">
                        We've built a different kind of high street bank. A bank with stores that are open when it suits you, where you can walk in without an appointment and leave with a working account, debit card and all. A bank that tells you exactly what you're getting, in language that actually makes sense. A bank that puts you first.
                    </p>
                </div>
            </div>
            <section className="">

                {/* Get Started Section */}
                <div className="max-w-5xl mx-auto p-12">
                    <h3 className="text-3xl font-semibold text-[#444] mb-10 text-center">Get Started</h3>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center justify-center gap-4 group">

                            <img src="/assets/images/get-started-chat.svg" alt="chat" className="w-12 h-12 lg:w-14 lg:h-14 text-white group-hover:scale-105 transition duration-300 ease-in-out" />

                            <p className="text-xl font-semibold text-tertiary">Live Support</p>
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

            {/* Find a Italian Location Section */}
            <section className="bg-accent py-12">
                <div className="max-w-4xl mx-auto px-8 md:px-4 flex flex-col md:flex-row items-center justify-center text-center gap-5 lg:gap-14">
                    <h3 className="text-3xl lg:text-5xl font-semibold text-tertiary font-sans">
                        Find a Italian location near you.
                    </h3>
                    <Button
                        className="bg-tertiary text-white rounded-full"
                    >
                        FIND A BRANCH
                    </Button>
                </div>
            </section>

            {/* You Might Also Like Section */}
            <section className="bg-[#f7f7f7]">
                <div className="py-16 container">
                    <h2 className="text-3xl md:text-4xl font-medium md:font-semibold text-[#444] mb-12 text-center">You Might Also Like</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center justify-start bg-white p-0 shadow-lg text-center">
                            <Badge className="top-4 left-4 bg-tertiary text-white rounded-none px-6 py-2 text-sm font-medium">LEARN & PLAN</Badge>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold text-accent mb-4">Pre-Vows: 7 Financial Questions</h3>
                                <p className="text-[#444] leading-relaxed text-base">
                                    Before you get married, it's important to talk to your significant other about finances. Get the scoop on the top 7 most important questions to ask your future spouse and a financial advisor.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-start bg-white p-0 shadow-lg text-center">
                            <Badge className="top-4 left-4 bg-tertiary text-white rounded-none px-6 py-2 text-sm font-medium">LEARN & PLAN</Badge>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold text-accent mb-4">Hidden Costs of the Holidays</h3>
                                <p className="text-[#444] leading-relaxed text-base">
                                    Learn more about recognizing the hidden costs of the holiday season, including increased home utility bills and travel expenses.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-start bg-white p-0 shadow-lg text-center">
                            <Badge className="top-4 left-4 bg-tertiary text-white rounded-none px-6 py-2 text-sm font-medium">LEARN & PLAN</Badge>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold text-accent mb-4">Financial Wellness & Self-Care</h3>
                                <p className="text-[#444] leading-relaxed text-base">
                                    Practicing self-care and financial wellness go hand in hand with keeping your overall health in check. Here are some ways you can work healthy financial habits into your regular routine.
                                </p>
                            </div>
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
