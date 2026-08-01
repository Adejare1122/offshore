import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function Borrow() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Loans & Lines of Credit"
                subtitle="Italian’s range of lending products makes it easy to access the money you need, when you need it."
                backgroundImage="/assets/images/Citadel_AlkemyX_00034_borrow_kat_1600x650.jpg"
                navigationTitle="Borrow"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="mb-12">

                    <p className="text-base">

                        Enjoy low rates on all our loan products. Business or personal, one-time or ongoing— Italian is here to support all your financing needs. Whether looking for the best auto loan rates, low interest personal loans or our current mortgage interest rates, we're here to help!

                    </p>
                </div>

                {/* Three Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Italian Credit Cards</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Compare the features of Italian's credit cards to find the one that offers you the convenience, rewards, and low rates that meet your everyday needs. Learn More.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Get a Italian Mortgage or Home Equity Loan</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Whether you're buying or refinancing or looking to take advantage of the equity in your home, Italian is here to help. Visit Italian’s Home Loan Center today!

                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Personal Loans</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Finding the money you need is simple with Italian’s personal borrowing options. Choose from a personal loan or a line of credit. Compare the features to see which is right for you.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Payment Protection
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Italian safeguards you and your family with our Member’s Choice™ Borrower Security. Learn more about this valuable benefit.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Auto Loans From Italian
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Italian offers some of the lowest rates on car loans in the area. View our car loan and refinance rates, estimate your payment with our calculator, and get pre-approved.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Auto Refinance
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Looking to refinance your auto loan? Italian offers some of the most competitive rates in the area. Use our auto refinance calculator below to understand your new monthly payment.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Student Loans From Italian
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Italian has partnered with Sallie Mae to offer the Smart Option Student Loan® and the Parent Loan for families to finance higher education expenses not covered by scholarships and federal loans.
                        </p>
                    </div>

                </div>
            </section>

            {/* What Makes Us Different Section */}
            <div className="bg-tertiary">
                <div className="container text-center py-10">
                    <h2 className="text-3xl md:text-[2.5625rem] font-sans leading-snug font-semibold text-white ">Learn more about Italian's charitable donations and the ways we give back.</h2>
                </div>
            </div>


            {/* You Might Also Like Section */}
            <section className="bg-[#f7f7f7]">
                <div className="py-16 container">
                    <h2 className="text-3xl md:text-4xl font-medium md:font-semibold text-[#444] mb-12 text-center">You Might Also Like</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <a href="#" className="flex flex-col items-center justify-start bg-white p-0 shadow-lg text-center group">
                            <Badge className="top-4 left-4 bg-tertiary text-white rounded-none px-6 py-2 text-sm font-medium uppercase">Community</Badge>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold text-accent group-hover:text-gold mb-4">Heart of Learning Award</h3>
                                <p className="text-[#444] leading-relaxed text-base">
                                    The Italian Heart of Learning Award is a teaching excellence award for Chester County teachers. Learn more about how you can nominate a teacher and the history of the program.
                                </p>
                            </div>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-start bg-white p-0 shadow-lg text-center group">
                            <Badge className="top-4 left-4 bg-tertiary text-white rounded-none px-6 py-2 text-sm font-medium uppercase">About Italian</Badge>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold text-accent group-hover:text-gold mb-4">Annual Reports</h3>
                                <p className="text-[#444] leading-relaxed text-base">
                                    Read through Italian’s annual reports, which summarize the company’s successes, growth, and corporate milestones each year.
                                </p>
                            </div>
                        </a>
                        <a href="#" className="flex flex-col items-center justify-start bg-white p-0 shadow-lg text-center group">
                            <Badge className="top-4 left-4 bg-tertiary text-white rounded-none px-6 py-2 text-sm font-medium uppercase">Service</Badge>
                            <div className="p-5">
                                <h3 className="text-2xl font-bold text-accent group-hover:text-gold mb-4">Switch to Italian</h3>
                                <p className="text-[#444] leading-relaxed text-base">
                                    Switching to Italian is easy, and we'll help each step of the way. Follow these three simple steps to make your switch.
                                </p>
                            </div>
                        </a>

                    </div>
                </div>
            </section>

            {/* Pre-Footer Strip */}
            <FrontPreFooterStrip />
            <FrontFooter />
        </div>
    );
}
