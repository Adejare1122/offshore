import { MessageCircle, Calendar, Phone, MapPin, Info, Clock, Mail, Video, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";
import { useState } from "react";
import { Link } from "wouter";

export default function CreditCards() {


    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Credit cards"
                subtitle="Compare Italian’s Credit Cards"
                backgroundImage="/assets/images/Citadel_AlkemyX_00034_borrow_kat_1600x650.jpg"
                navigationTitle="Credit cards"
            />

            {/* About Italian Section */}
            <section className="pt-12 md:pt-10 pb-4 container">
                <div className="space-y-5 md:space-y-8">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold">
                        Compare Credit Cards
                    </h2>
                    <p className="text-base">
                        Compare the features of Italian Mastercards to find the one that offers you the convenience, rewards, and low rates that meet your everyday needs. Italian offers credit cards with low APR, cash rewards, and rewards for travel and entertainment. Plus enjoy no balance transfer fees, no matter which credit card you choose.
                    </p>
                    <p className="text-base">
                        To learn more about Italian's low APR credit cards, credit card offers and much more schedule an appointment today!
                    </p>
                    <p className="text-base italic">
                        *Offers are subject to credit approval. APR = Annual Percentage Rate. Read Full Disclosures.
                    </p>
                </div>
            </section>

            {/* Now Comparing Bar */}
            <section className="">
                <div className="container">
                    <div className="p-6 bg-tertiary flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-3xl text-white font-semibold">Now Comparing:</span>
                            <span className="text-white">No items selected</span>
                        </div>
                        <span className="text-white">Select at least 2 items to compare</span>
                    </div>

                    {/* World Mastercard */}
                    <div className="bg-slate-100 p-6">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-2xl font-sans font-semibold text-tertiary mb-8">World Mastercard</h3>

                                <div className="flex flex-col md:flex-row items-start gap-0 md:gap-10">
                                    <img src="/assets/images/best-credit-cards-for-young-adults364a.svg" alt="Image" className="object-contain w-1/2 md:w-1/5" />

                                    <div className="w-1/2 md:w-1/5 flex flex-col items-center space-y-3 md:order-last">
                                        <Button className="bg-gold text-white hover:bg-gold/90 px-8 py-3 rounded-full font-semibold">
                                            APPLY ONLINE
                                        </Button>
                                        <div className="flex items-center space-x-2">
                                            <input type="checkbox" id="world-mastercard" className="w-4 h-4" />
                                            <label htmlFor="world-mastercard" className="text-sm font-medium text-gray-700">COMPARE</label>
                                        </div>
                                    </div>

                                    <div className="w-2/5">
                                        <h4 className="font-bold text-tertiary mb-2">At a Glance:</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Earn double Mastercard rewards points on hotels, airlines, and restaurants. Plus enjoy exclusive benefits like Free WIFI, Trip Cancellation, Car Rental Insurance, and more. No annual fee and no balance transfer fee.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Rates as Low as:</h4>
                                        <div className="text-4xl font-bold text-gold">14.49%</div>
                                        <div className="text-sm text-gray-600">APR</div>
                                    </div>

                                    <div className="w-2/5">
                                        <h4 className="font-bold text-tertiary mb-2">Features:</h4>
                                        <p className="text-gray-700 text-sm">
                                            No Annual Fee; Earn 2 Points for every $1 spent on Travel & Dining, and 1 Point per $1 on all other Purchases; No Foreign Transaction Fees
                                        </p>
                                    </div>


                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* Credit Cards Section */}
            <section className="bg-white py-10">
                <div className="container space-y-6">


                    {/* Cash Rewards Mastercard */}
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-tertiary mb-4">Cash Rewards Mastercard</h3>

                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <div className="w-8 h-5 bg-white rounded border-2 border-tertiary relative">
                                            <div className="absolute top-1 left-1 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-3 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-5 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-7 w-1 h-1 bg-tertiary rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-tertiary mb-2">At a Glance:</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Earn 1.5% cash back on every dollar you spend. Cash back is automatically deposited into your checking or savings account. No annual fee and no balance transfer fee.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Rates as Low as:</h4>
                                        <div className="text-4xl font-bold text-gold">15.49%</div>
                                        <div className="text-sm text-gray-600">APR</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Features:</h4>
                                        <p className="text-gray-700 text-sm">
                                            No Annual Fee; 1.5% Cash Back on all Purchases; Easy Redemption
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 flex flex-col items-center space-y-3">
                                <Button className="bg-gold text-white hover:bg-gold/90 px-8 py-3 rounded-full font-semibold">
                                    APPLY ONLINE
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="cash-rewards" className="w-4 h-4" />
                                    <label htmlFor="cash-rewards" className="text-sm font-medium text-gray-700">COMPARE</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rewards Mastercard */}
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-tertiary mb-4">Rewards Mastercard</h3>

                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <div className="w-8 h-5 bg-white rounded border-2 border-tertiary relative">
                                            <div className="absolute top-1 left-1 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-3 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-5 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-7 w-1 h-1 bg-tertiary rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-tertiary mb-2">At a Glance:</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Earn unlimited rewards with a low fixed rate. Redeem your points for gift cards, travel, merchandise, and cash. No annual fee and no balance transfer fee.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Rates as Low as:</h4>
                                        <div className="text-4xl font-bold text-gold">9.99%</div>
                                        <div className="text-sm text-gray-600">APR</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Features:</h4>
                                        <p className="text-gray-700 text-sm">
                                            No Annual Fee; Fixed Rate; Earn 1 Point for Every $1 Spent on all Purchases
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 flex flex-col items-center space-y-3">
                                <Button className="bg-gold text-white hover:bg-gold/90 px-8 py-3 rounded-full font-semibold">
                                    APPLY ONLINE
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="rewards-mastercard" className="w-4 h-4" />
                                    <label htmlFor="rewards-mastercard" className="text-sm font-medium text-gray-700">COMPARE</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Choice Mastercard */}
                    <div className="bg-gray-100 p-6 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-tertiary mb-4">Choice Mastercard</h3>

                                <div className="flex items-start space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-tertiary rounded-lg flex items-center justify-center flex-shrink-0">
                                        <div className="w-8 h-5 bg-white rounded border-2 border-tertiary relative">
                                            <div className="absolute top-1 left-1 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-3 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-5 w-1 h-1 bg-tertiary rounded-full"></div>
                                            <div className="absolute top-1 left-7 w-1 h-1 bg-tertiary rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-tertiary mb-2">At a Glance:</h4>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            Perfect for building credit or looking for a low APR card. No annual fee and no balance transfer fee.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Rates as Low as:</h4>
                                        <div className="text-4xl font-bold text-gold">11.49%</div>
                                        <div className="text-sm text-gray-600">APR</div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-tertiary mb-2">Features:</h4>
                                        <p className="text-gray-700 text-sm">
                                            No Annual Fees; Low Credit Card Rates; No Balance Transfer Fee
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="ml-6 flex flex-col items-center space-y-3">
                                <Button className="bg-gold text-white hover:bg-gold/90 px-8 py-3 rounded-full font-semibold">
                                    APPLY ONLINE
                                </Button>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="choice-mastercard" className="w-4 h-4" />
                                    <label htmlFor="choice-mastercard" className="text-sm font-medium text-gray-700">COMPARE</label>
                                </div>
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
