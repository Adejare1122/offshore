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

export default function FAQs() {
    const [openItems, setOpenItems] = useState<number[]>([]);

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const faqData = [
        {
            question: "Is the company registered and regulated",
            answer: "Yes, our Company is totally a legal platform licensed by the Securities and Exchange Commission to carry out financial activities in over 105 countries?"
        },
        {
            question: "What is the field of activity of the company?",
            answer: "The company is engaged in cryptocurrency and Forex trading. Our staff of highly qualified traders and financial experts shows high profit rates from year to year. The company's priorities are access to international markets and long-term cooperation with investors."
        },
        {
            question: "Who can be a Customer of Givens Hall Bank?",
            answer: "Everyone can be a Customer of Givens Hall Bank, but he\she must be not less 18 years old."
        },
        {
            question: "How can I become an investor in the company?",
            answer: "You may become a client of the company and it is totally free of charge. All you need is to sign up and fill all required fields. It takes less than 2 minutes to complete sign up."
        },
        {
            question: "How reliable is the company in terms of security and personal data?",
            answer: "We pay great attention to security and privacy. All information on our website is protected by SSL. We do not divulge any personal data of our customers to third parties. Your participation is strictly confidential."
        },
        {
            question: "Is there a KYC verification process?",
            answer: "Yes, we do require verification documents confirming the identity, address or origin of account owner."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Frequently Asked Questions"
                subtitle="What's on your mind? There are lots of ways to get in touch with us. Search our FAQs"
                backgroundImage="/assets/images/Citadel_AlkemyX_00405_weatlh_kate_1600x650.jpg"
                navigationTitle="Frequently Asked Questions"
            />

            {/* About Italian Section */}
            <section className="pt-12 md:pt-10 pb-4 container">
                <div className="space-y-5 md:space-y-8">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold">
                        Frequently Asked Questions
                    </h2>
                </div>
            </section>

            <section className="bg-[#f3f3f3] px-4 py-10">
                <div className="container py-4 bg-white shadow-lg">
                    <div className="space-y-4">
                        {faqData.map((faq, index) => (
                            <div key={index} className="">
                                <button
                                    onClick={() => toggleItem(index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between bg-[#f7f7f7] hover:text-gold text-tertiary font-medium transition-colors"
                                >
                                    <span className="text-lg md:text-xl font-semibold pr-4">
                                        {faq.question}
                                    </span>
                                    {openItems.includes(index) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                    )}
                                </button>
                                {openItems.includes(index) && (
                                    <div className="px-6 pb-4">
                                        <div className="border-t border-gray-100 pt-4">
                                            <p className="text-gray-700 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <p className="text-center">Still have questions? <Link className="text-primary font-semibold" href="/customer-support">Contact Us</Link>.</p>
                    </div>
                </div>
            </section>

            {/* Pre-Footer Strip */}
            <FrontPreFooterStrip />
            <FrontFooter />
        </div>
    );
}
