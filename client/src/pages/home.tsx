import { Link } from "wouter";
import { useState } from "react";
import { CreditCard, Building2, PiggyBank, Wallet, Landmark, Percent, Phone, Mail, Clock, HelpCircle, MessageSquare, Globe2, Lock, Plus, PlusIcon, ChevronRightIcon } from "lucide-react";
import FrontHeader from "@/components/front-header";
import FrontHero from "@/components/front-hero";
import FrontTabSection from "@/components/front-tab-section";
import ServicesSection from "@/components/front-services-section";
import FeatureSection from "@/components/front-feature-section";
import TestimonialsSection from "@/components/front-testimonial-section";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";
import FrontFooter from "@/components/front-footer";
import { Button } from "@/components/ui/button";
import PostCard from "@/components/post-card";

export default function Home() {
    const [bankOpen, setBankOpen] = useState(false);
    return (
        <div className="min-h-screen bg-white text-gray-900 relative">
            {/* Header */}
            <FrontHeader />

            {/* Hero */}
            <FrontHero />

            {/* Bottom CTAs - Centered and Overflowing */}
            <div className="relative hidden md:block -mt-10 z-30 w-full  ">
                <div className="flex w-full max-w-[45rem] mx-auto">
                    {/* Routing Number */}
                    <div
                        className="bg-tertiary text-tertiary-foreground px-8 py-4 cursor-pointer hover-elevate text-center rounded-tl-lg w-1/2"
                        data-testid="button-routing-number"
                        onClick={() => console.log('Routing number clicked')}
                    >
                        <div className="text-lg uppercase font-bold mb-1 leading-none">ROUTING #</div>
                        <div className="text-xl font-bold leading-none">21084429</div>
                    </div>

                    {/* Branch Hours */}
                    <div
                        className="text-tertiary px-8 py-4 cursor-pointer hover-elevate flex items-center justify-center gap-3 text-center rounded-br-lg w-1/2 bg-accent"
                        data-testid="button-branch-hours"
                        onClick={() => console.log('Branch hours clicked')}
                    >
                        <img src="/assets/images/ico-clock-new.svg" className="w-10 h-10" alt="Clock" />
                        <div className="text-lg uppercase font-bold leading-none">BRANCH HOURS</div>
                        <div className="text-lg font-bold leading-none"><PlusIcon className="w-6 h-6" /></div>
                    </div>
                </div>
            </div>

            {/* Rates + Member Care */}
            <FrontTabSection />

            {/* Services Icons */}
            <ServicesSection />

            {/* Promo + image */}
            <FeatureSection></FeatureSection>

            {/* Articles grid (hero + list) */}
            <section className="py-6">
                <div className="md:container">
                    <h3 className="text-2xl text-center md:text-left text-black uppercase font-sans font-semibold">Start Building Your Financial Strength</h3>
                    <div className="mt-6 grid md:grid-cols-12 gap-0">
                        <div className="md:col-span-9">
                            <PostCard
                                title="Tax Checklist: 5 Things to Remember"
                                link="/tax-checklist-5-things-to-remember"
                                backgroundImage="/assets/images/tax-checklist-5-things-to-remember.jpg"
                                subtitle="Tax season is quickly approaching—do
                                            you know what you need to claim, and what forms you need to submit? This tax checklist makes filing simple. Learn more today!"
                                size="big"
                            />

                        </div>
                        <div className="flex flex-col md:col-span-3">
                            <PostCard
                                title="How to Manage Your Checking"
                                link="/simple-ways-to-manage-a-checking-account"
                                backgroundImage="/assets/images/simple-ways-to-manage-a-checking-account.jpg"
                                size="small"
                            />
                            <PostCard
                                title="How to Save for Summer Vacation"
                                link="/how-to-save-for-summer-vacation"
                                backgroundImage="/assets/images/how-to-save-for-summer-vacation.jpg"
                                size="small"
                            />
                            <PostCard
                                title="How Rising Rates and Inflation Impact Businesses"
                                link="/the-impact-of-rising-rates-and-inflation-on-your-business"
                                backgroundImage="/assets/images/the-impact-of-rising-rates-and-inflation-on-your-business.jpg"
                                size="small"
                            />
                        </div>
                    </div>
                </div>
            </section >

            {/* Testimonials */}
            <TestimonialsSection></TestimonialsSection >

            {/* Pre-Footer Strip */}
            < FrontPreFooterStrip />

            {/* Footer */}
            < FrontFooter />
        </div >
    );
}



