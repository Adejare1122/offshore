import { Link } from "wouter";
import { Separator } from "./ui/separator";

export default function FrontFooter() {
    return (
        <footer className="bg-tertiary ">
            {/* Main Footer Content */}
            <div className="container py-12 text-white">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                    {/* Left Section */}
                    <div className="md:col-span-3 text-center md:text-left">
                        {/* Building Strength Together */}
                        <h2 className="text-4xl md:text-4xl text-white font-semibold mb-4">Building Strength Together</h2>
                        <p className="text-lg md:text-lg leading-normal font-medium mb-6">
                            Italian is a not-for-profit credit union bank built on the unshakeable promise to serve those who work every day to build a better future for us all. For over 80 years, we've delivered a breadth of financial services, expert guidance, and innovative tools to help strengthen and grow businesses, families, and our local communities. We are your Italian, and we are Building Strength Together.
                        </p>

                        {/* Horizontal separator */}
                        <div className="border-t border-accent mb-6"></div>

                        {/* Navigation Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-accent text-lg md:text-lg font-semibold uppercase tracking-wide mb-2">ABOUT ITALIAN</h3>
                                    <ul className="space-y-1 text-lg md:text-lg">
                                        <li><Link href="/about-us" className="hover:text-accent transition-colors">Who we are</Link></li>
                                        <li><Link href="/customer-support" className="hover:text-accent transition-colors">Contact Us</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-accent text-lg md:text-lg font-semibold uppercase tracking-wide mb-2">NEWS & EVENTS</h3>
                                    <ul className="space-y-1">
                                        <li><Link href="/news" className="text-lg md:text-lg hover:text-accent transition-colors">Latest News</Link></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-accent text-lg md:text-lg font-semibold uppercase tracking-wide mb-2">CAREERS</h3>
                                    <ul className="space-y-1">
                                        <li><Link href="/careers" className="text-lg md:text-lg hover:text-accent transition-colors">Get Started</Link></li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-accent text-lg md:text-lg font-semibold uppercase tracking-wide mb-2">GIVING BACK</h3>
                                    <ul className="space-y-1">
                                        <li><Link href="/givin-back" className="text-lg md:text-lg hover:text-accent transition-colors">Italian Charity</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="md:col-span-2 text-center md:text-left">
                        {/* Member Services */}
                        <h2 className="text-2xl md:text-3xl text-white font-sans font-bold mb-4">
                            <a>Member Services</a>
                        </h2>
                        <ul className="space-y-0 mb-6 font-semibold">
                            <li><Link href="#" className="text-lg md:text-lg hover:text-accent transition-colors">Loan Payments</Link></li>
                            <li><Link href="#" className="text-lg md:text-lg hover:text-accent transition-colors">Referral Service</Link></li>
                            <li><Link href="#" className="text-lg md:text-lg hover:text-accent transition-colors">Italian Security™</Link></li>
                            <li><Link href="mailto:info@italiannationaloffshore.com" className="text-lg md:text-lg hover:text-accent transition-colors">Email Us</Link></li>
                        </ul>

                        {/* Italian National Logo */}
                        <div className="mb-2">
                            <img src="/assets/images/logo.png" alt="Logo" className="h-8 w-auto mx-auto md:mx-0" />
                        </div>

                        {/* Horizontal separator */}
                        <div className="border-t border-accent mb-6"></div>

                        {/* Location */}
                        <div>
                            <h3 className="text-accent text-lg md:text-lg font-semibold uppercase tracking-wide mb-2">LOCATION</h3>
                            <a href="#" className="text-lg md:text-lg">Isola S. Clemente, 1/1, 30124 Venezia VE, Italy</a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Legal Bar */}
            <div className="bg-white py-8 md:py-8">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Left - Legal Links */}
                        <div className="flex flex-col md:flex-row md:divide-x items-center gap-2 md:gap-4 text-lg md:text-lg font-medium">
                            <Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                            <Link href="/faq" className="hover:text-accent transition-colors">FAQs</Link>
                            <Link href="/sitemap" className="hover:text-accent transition-colors">Sitemap</Link>
                        </div>

                        {/* Right - Accreditation Badges */}
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                            {/* BBB Badge */}
                            <div className="flex items-center gap-2">
                                <img src="/assets/images/blue-seal-200-42-bbb-80015515.png" className="h-10 md:h-11 w-auto object-contain" />
                            </div>

                            {/* Equal Housing */}
                            <div className="flex items-center gap-2">
                                <img src="/assets/images/ncua-lender.png" className="h-10 md:h-11 w-auto object-contain" />
                            </div>

                            {/* NCUA */}
                            <div className="flex items-center gap-2">
                                <img src="/assets/images/ncua-cert.png" className="h-10 md:h-11 w-auto object-contain" />

                            </div>
                            <div className="">
                                <div className="font-medium italic">Federally Insured by NCUA</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="fixed bottom-0 left-0 w-full bg-primary text-white z-50 block md:hidden">
                <div className="grid grid-cols-2">
                    <button
                        onClick={() => window.dispatchEvent(new Event('app:open-login'))}
                        className="flex items-center justify-center py-4 font-semibold text-lg hover:bg-primary/90 transition-colors w-full"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => window.dispatchEvent(new Event('app:open-register'))}
                        className="flex items-center justify-center py-4 font-semibold text-lg hover:bg-primary/90 transition-colors w-full"
                    >
                        Open Account
                    </button>
                </div>
            </nav>
        </footer>
    );
}
