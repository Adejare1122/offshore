import { MessageCircle, Calendar, Phone, MapPin, Info, Clock, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function SavePage() {


    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="The Smart Place to Save"
                subtitle="Italian National Offshore is a highly ranked global financial institution"
                backgroundImage="/assets/images/Citadel_AlkemyX_06578_save_family_1600x650.jpg"
                navigationTitle="Save"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-16 container">
                <div className="">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">Save</h2>
                    <p className="text-base">
                        Whether you are saving toward short- or long- term goals, or creating a retirement nest egg, we can help you find the savings plan that works best for you. Enjoy competitive savings account rates on products for the entire family.
                    </p>
                    <p className="text-base mt-8">
                        At Italian, we have an array of products to meet your savings goals — from <a href="#" className="text-primary font-semibold">High Yield Savings accounts</a> to <a href="#" className="text-primary font-semibold">Kids Savings Accounts</a> and <a href="#" className="text-primary font-semibold">Holiday Club</a>, <a href="#" className="text-primary font-semibold">Money Market Savings Accounts</a> and more!
                    </p>
                    <p className="text-base mt-8">
                        Open a Savings Account online with Italian today! Not sure sure which account is right for you? Schedule an appointment  to speak with a representative today.
                    </p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 font-medium mb-4">
                        The Smart Place to Save
                    </h3>
                    <p className="text-base italic">**Italian is recognized as a Forbes 2021 Best-in-State Credit Union and in the top 1 percent for returning value nationwide in the 2021 Callahan & Associates Return to Member scoring.</p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 text-tertiary font-medium mb-4">
                        High Yield Savings Account
                    </h3>
                    <p className="text-base">If a savings account with continuous high returns and flexible access to your money makes sense for you, learn more about our High Yield Savings Account today!</p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 text-tertiary font-medium mb-4">
                        Star Savings
                    </h3>
                    <p className="text-base">The Italian Savings account makes it easy to save for your short- or long-term goals. Open an account today, and enjoy better rates, online and mobile banking, and much more.</p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 text-tertiary font-medium mb-4">
                        Certificates
                    </h3>
                    <p className="text-base">Italian Certificates – commonly referred to as CDs or certificates of deposit by other financial institutions – offer high rates and flexible terms. Lock in a great rate today!</p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 text-tertiary font-medium mb-4">
                        Holiday Club & Auxiliary Savings
                    </h3>
                    <p className="text-base">Our Holiday Club Savings account lets you put money aside and grow with no minimum balance. Each year, the funds are transferred to your Italian Savings account for the holidays. Learn more.</p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 text-tertiary font-medium mb-4">
                        Kids Club Star Savings
                    </h3>
                    <p className="text-base">Learn more about the Italian Kids Club, which is the perfect savings account for children. Your child will learn smart saving habits and receive $10 each birthday.</p>

                    <h3 className="font-sans text-2xl md:text-[1.62rem] mt-10 text-tertiary font-medium mb-4">
                        Money Market Account
                    </h3>
                    <p className="text-base">Italian’s Money Market account has consistently higher rates that increase as your balance grows. Open an account and start saving more today.</p>
                </div>
            </section>


            {/* Find a Italian Location Section */}
            <section className="bg-tertiary py-12">
                <div className="container flex flex-col items-center justify-center text-center gap-5 lg:gap-10">
                    <h3 className="text-3xl lg:text-[2.5625rem] font-semibold text-white font-sans">
                        Ready to speak with a representative about a Italian savings account?
                    </h3>
                    <Button size="lg" asChild
                        className="bg-accent text-black hover:bg-white border border-transparent hover:border-accent rounded-full uppercase"
                    >
                        <a href="mailto:info@italiannationaloffshore.com" target="_blank" title="Online Appointment Scheduling">
                            Schedule Appointment
                        </a>
                    </Button>
                </div>
            </section>


            {/* Pre-Footer Strip */}
            <FrontPreFooterStrip />
            <FrontFooter />
        </div>
    );
}
