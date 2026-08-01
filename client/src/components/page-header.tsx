import { PlusCircleIcon, PlusIcon } from "lucide-react";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    parentNavigationTitle?: string;
    navigationTitle?: string;
}

export default function PageHeader({
    title,
    subtitle,
    backgroundImage,
    parentNavigationTitle,
    navigationTitle
}: PageHeaderProps) {
    return (
        <>
            {/* Hero Section with Background Collage */}
            {backgroundImage && (
                <section className="relative -mt-6 min-h-[400px] overflow-hidden">
                    {/* Background Image */}
                    {backgroundImage && (
                        <div
                            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                            style={{ backgroundImage: `url(${backgroundImage})` }}
                        >
                            {/* Dark Overlay for text readability */}
                            <div className="absolute inset-0 bg-black/50"></div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="relative z-10 pt-[117px] pb-[70px] h-full flex flex-col justify-center items-center text-center px-4">
                        {title && (
                            <h1 className="font-sans text-4xl md:text-5xl font-semibold text-white mb-6">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-md font-medium md:text-xl text-white max-w-4xl leading-snug md:leading-normal">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Breadcrumb Section */}
            <section className="hidden md:block w-full">
                <nav className="w-full bg-[#2548af] relative block">
                    <ul className="container py-0 flex bg-[#f7f7f7] px-0 after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-1/5 after:h-full after:bg-[#f7f7f7] font-medium">
                        {(parentNavigationTitle || navigationTitle) && (
                            <li className="bg-[#2548af] px-8 border-l border-gray-700 flex items-center gap-2 w-72">
                                <div className="py-6 font-semibold text-white flex-1">{parentNavigationTitle ? parentNavigationTitle : navigationTitle}
                                </div>
                                <PlusCircleIcon className="w-6 h-6 text-white" />
                            </li>
                        )}
                        {navigationTitle && (
                            <li className="flex items-center bg-[#f7f7f7]">
                                <span className=' px-10 py-6'>
                                    {navigationTitle}
                                </span>
                            </li>
                        )}
                    </ul>
                </nav>
            </section >
        </>
    );
}
