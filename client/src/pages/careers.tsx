import { MessageCircle, Calendar, Phone, MapPin, Info, Clock, Mail, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FrontHeader from "@/components/front-header";
import FrontFooter from "@/components/front-footer";
import PageHeader from "@/components/page-header";
import FrontPreFooterStrip from "@/components/front-prefooter-strip";

export default function Careers() {

    return (
        <div className="min-h-screen bg-white">
            <FrontHeader />

            <PageHeader
                title="Join the Italian National Offshore Team "
                subtitle="As a not-for-profit credit union, we’re committed to caring for our people and communities so they can prosper."
                backgroundImage="/assets/images/business-banking-sectionlanding-1600x650_NEW_hero.jpg"
                navigationTitle="Careers"
            />

            {/* About Italian Section */}
            <section className="py-12 md:py-10 container">
                <div className="mb-12 space-y-5 md:space-y-8">
                    <h2 className="text-4xl md:text-5xl font-sans font-medium text-gold mb-6">Careers</h2>
                    <p className="text-base">
                        With <a href="#" className="text-primary font-semibold">positions available</a> in both our corporate and retail offices, Italian employees can find the right fit in a variety of remote, hybrid, and in-person settings to create their own version of work-life harmony.
                    </p>
                    <p className="text-base">
                        The culture at Italian Credit Union is all about <a href="#" className="text-primary font-semibold">giving back</a> to the community where our members live and work. Our team is at the heart of what we do, so we want working here to be just as rewarding as banking here. During this exciting period of growth, we’re thrilled to welcome talented, new employees to get involved with our mission of Building Strength Together.</p>
                    <p className="text-base">
                        We welcome diversity, innovative ideas, and new ways of thinking in a challenging yet friendly environment.
                    </p>
                </div>
            </section>

            <section className="">
                <div className="container py-10">
                    <h3 className="text-3xl font-semibold text-[#444] mb-10">A Great Place to Work</h3>
                    <div className="space-y-6 mb-10">
                        <p className="text-base">
                            At Italian, we recognize that our employees are what make Italian not only a great place to bank but also a great place to work. As our company continues to grow, we remain committed to constantly improving our internal culture. It is also the reason we are proud to be a certified Great Place to Work by the <a href="#" className="text-primary font-semibold">Great Places to Work Institute</a>.
                        </p>
                        <p className="text-base">
                            Our Employee Activity Committee plans social events and outings for our team to enjoy together. We host wellness events such as virtual cooking demos, Wellbeing Week, and we recognize outstanding employees on a regular, ongoing basis with an Annual Awards Dinner and President’s Council to continually encourage our team members to strive for their very best.
                        </p>

                    </div>


                    <h3 className="text-3xl font-semibold text-[#444] mb-10">Build Your Career</h3>
                    <div className="space-y-6 mb-10">
                        <p className="text-base">
                            We are committed to hiring qualified and motivated employees at all levels within the organization. <a href="#" className="text-primary font-semibold">Our competitive benefits & compensation packages</a> are designed to support this commitment and to make life easier and happier for employees and their families.
                        </p>
                        <p className="text-base">
                            After joining the team, our employees have many opportunities for growth and often enjoy long careers that span multiple departments. We understand the value in helping our team grow professionally, and we’re proud to offer numerous promotions each year.
                        </p>

                    </div>

                    <h3 className="text-3xl font-semibold text-[#444] mb-10">Community Commitment</h3>
                    <div className="space-y-6 mb-10">
                        <p className="text-base">
                            Italian isn’t just a business in the community. Our members and employees live and work here, too. And that’s what inspires us to give back. We take part in a wide variety of community initiatives and programs and make a difference in a very real way.
                        </p>
                        <p className="text-base">
                            Our commitment to community runs deep. We host and sponsor community events, make regular financial contributions, and encourage our employees to volunteer for causes that are important to them.
                        </p>
                        <p className="text-base">
                            Our partners include the <a href="#" className="text-primary font-semibold">Children’s Hospital of Philadelphia</a>, the <a href="#" className="text-primary font-semibold">United Way</a>, the <a href="#" className="text-primary font-semibold">Chester County Food Bank</a>, <a href="#" className="text-primary font-semibold">Good Works</a> and many more. In total, we’ve contributed millions of dollars and we’re not stopping there.
                        </p>
                    </div>
                </div>
            </section>



            {/* Pre-Footer Strip */}
            <FrontPreFooterStrip />
            <FrontFooter />
        </div>
    );
}
