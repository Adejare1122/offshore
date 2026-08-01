import { ChevronRightIcon, PlusCircleIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "wouter";

interface PostCardProps {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    size?: string | 'small' | 'big';
    link: string;
}

export default function PostCard({
    title,
    subtitle,
    backgroundImage,
    size,
    link
}: PostCardProps) {
    return (
        <div className="relative group">
            <img className="w-full h-full object-cover" src={backgroundImage} />
            <div className={`absolute bottom-0 left-0 right-0 inset-0 bg-gradient-to-t from-black/80 to-transparent text-white flex flex-col justify-end`}>
                <div className={`p-5 ${size === 'small' ? 'md:p-5' : 'md:p-8'}`}>
                    <Button className="px-4 py-1.5 h-auto rounded-full font-semibold text-xs uppercase bg-[#172d51] hover:bg-accent hover:text-tertiary" asChild>
                        <a href="#">Starting Out</a>
                    </Button>

                    {title && (
                        <div className={`text-white items-center gap-4 mt-2 ${size === 'big' ? 'hidden md:flex' : 'flex'}`}>
                            <h2 className={`text-white ${size === 'small' ? 'text-[1.25rem] font-medium' : 'text-3xl font-semibold'}`}>
                                <Link href={link} className="inline before:absolute before:w-full before:h-full before:top-0 before:inset-0 before:content-['']">
                                    <span>{title}</span>

                                    <ChevronRightIcon className={`will-change-auto transition-all ease-in-out duration-300 group-hover:ml-2 inline ${size === 'small' ? 'size-6' : 'size-8'}`}></ChevronRightIcon>
                                </Link>


                            </h2>

                        </div>
                    )}
                    {subtitle && (
                        < div className={`text-white text-lg font-medium mt-2 ${size === 'big' ? 'hidden md:flex' : 'block'}`}>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {size == 'big' && (
                <div className="bg-white z-1 relative flex flex-col gap-0 p-5 px-6 md:hidden">
                    {title && (
                        <div className={`items-center gap-4 flex`}>
                            <h2 className={`text-tertiary text-[1.25rem] font-semibold`}>
                                <Link href={link} className="inline before:absolute before:w-full before:h-full before:top-0 before:inset-0 before:content-['']">
                                    <span>{title}</span>

                                    <ChevronRightIcon className={`will-change-auto transition-all ease-in-out duration-300 group-hover:ml-2 inline size-6`}></ChevronRightIcon>
                                </Link>
                            </h2>

                        </div>
                    )}
                    {subtitle && (
                        < div className={`text-base font-medium mt-2`}>
                            {subtitle}
                        </div>
                    )}
                </div>
            )}
        </div >
    );
}
