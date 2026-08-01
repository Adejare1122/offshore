import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function Invest() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Helping You Invest in Your Future"
                subtitle="Whether you’re starting to save or ready to retire, we have investment solutions to help meet your needs."
                backgroundImage="/assets/images/Citadel_AlkemyX_00405_weatlh_kate_1600x650.jpg"
                navigationTitle="Wealth & Retire"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="mb-12 text-[#717171]">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">
                        Wealth & Retire
                    </h2>
                    <p className="text-base">
                        From building college savings and growing your retirement during working years to retirement planning and asset management—our CFS Financial Advisors offer personalized financial services and investment advice to help you prepare for every stage of life. Whether you're interested in rolling over an IRA, estate planning or simply how to manage money - our investment advisors are here to help.
                    </p>
                    <p className="text-base mt-5">
                        Being a Italian customer, you'll have access to your very own personal finance advisor to help guide you through process of financial budgeting, retirement savings and more. <a href="#" className="text-primary font-semibold">Contact an investment advisor</a> today to schedule a complimentary consultation.
                    </p>
                    <p className="text-base mt-5">
                        Manage your portfolio, check quotes, make trades, and more online. Take full control of your future and manage your investments anywhere, at any time with Italian’s convenient <a href="#" className="text-primary font-semibold">online investing and brokerage tools.</a>.
                    </p>
                    <p className="text-base mt-5">
                        Check the background of this firm on <a href="#" className="text-primary font-semibold">FINRA’s BrokerCheck</a>.
                    </p>
                    <p className="text-sm italic mt-5">
                        CFS does not provide legal or tax advice. Please consult a qualified tax or legal professional.
                    </p>
                    <p className="text-sm italic mt-5">
                        *Non-deposit investment products and services are offered through CUSO Financial Services, L.P. ("CFS"), a registered broker-dealer (Member <a href="#">FINRA</a>/<a href="#">SIPC</a>) and SEC Registered Investment Advisor. Products offered through CFS: are <b>not NCUA/NCUSIF or otherwise federally insured, are not guarantees or obligations of Italian, and may involve investment risk including possible loss of principal</b>.Investment Representatives are registered through CFS. Italian has contracted with CFS to make non-deposit investment products and services available to Italian members. CUSO Financial Services, L.P. (CFS) does not provide tax or legal advice. For such guidance, please consult your tax and/or legal advisor.
                    </p>
                </div>

                {/* Three Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Our Investment Team</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Schedule a complimentary consultation with a CFS advisor at Italian to help you manage your assets, create your retirement plan, and guide you toward your financial goals.
                        </p>
                    </a>

                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Retirement Planning</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            The experienced CFS* investment advisors at Italian can help you plan for your future with investment strategies and retirement income planning customized for your needs.
                        </p>
                    </a>

                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Financial Planning</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            CFS Financial Advisors at Italian offer professional analysis, sound financial guidance, and personalized, professional planning services to help you meet your short- and long-term financial goals.
                        </p>
                    </a>

                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Estate Planning & Wealth Transfer
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            We’ll help plan your estate allocation and work to ensure a smooth transition when a loved one passes away. We assist in transferring wealth to beneficiaries through tax-efficient strategies.
                        </p>
                    </a>

                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">IRA Rollover Assistance
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Together we’ll navigate how to best initiate your rollover, if appropriate, and help reduce tax liability in the event of severance from employment, termination, or retirement after years of service.
                        </p>
                    </a>

                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Talk to An Investment Advisor
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Our financial advisors, available through CUSO Financial Services, L.P. (CFS*), can help you develop a personalized plan for the years ahead to build wealth, protect your assets, and make sound decisions that move you closer to your financial goals.
                        </p>
                    </a>

                    <a href="#" className="flex flex-col gap-4 p-4 py-5 pb-[60px] bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Online Investing & Brokerage
                        </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Smart tools for smarter investing. Manage your portfolio, check quotes, make trades, and more online. Get started with our suite of tools today.
                        </p>
                    </a>

                </div>
            </section >

            {/* What Makes Us Different Section */}
            < div className="bg-tertiary" >
                <div className="container text-center py-10">
                    <h2 className="text-3xl md:text-[2.5625rem] font-sans leading-snug font-semibold text-white ">Learn more about Italian's charitable donations and the ways we give back.</h2>
                </div>
            </div >


            {/* You Might Also Like Section */}
            < section className="bg-[#f7f7f7]" >
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
            </section >

            {/* Pre-Footer Strip */}
            < FrontPreFooterStrip />
            <FrontFooter />
        </div >
    );
}
