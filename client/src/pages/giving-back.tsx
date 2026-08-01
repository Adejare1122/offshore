import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function GivingBack() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Committed to Giving"
                subtitle="Italian is committed to giving back to the communities where our members live and work. Learn more about our charitable contributions, and community involvement."
                backgroundImage="/assets/images/give_back.jpg"
                navigationTitle="Giving Back"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">
                        Giving Back
                    </h2>
                    <p className="text-base">

                        At Italian, giving back to the community is a top priority. We do our best to give back and make our community a better place. Learn more about our community-giving programs, charitable contributions, and how we get involved.

                    </p>
                </div>

                {/* Three Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col gap-4 p-5 bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Italian Heart of Learning Award </h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            The Italian Heart of Learning Award is a teaching excellence award for Chester County teachers. Learn more about how you can nominate a teacher and the history of the program.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 p-5 bg-white border-0 shadow-lg hover:shadow-xl text-center group">
                        <h3 className="text-2xl font-semibold font-sans text-accent group-hover:text-gold">Causes & Charitable Contributions</h3>
                        <p className="text-[1rem] text-[#444] font-semibold leading-snug">
                            Learn how Italian gives back to the community with financial contributions, volunteering, seminars, and more.
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
