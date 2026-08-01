import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Testimonial {
    name: string;
    content: string;
}

export default function TestimonialsSection() {
    const [currentIndex, setCurrentIndex] = useState(0);

    //todo: remove mock functionality - replace with real testimonial data
    const testimonials: Testimonial[] = [
        {
            name: "Ralph Morris",
            content: "I am impressed with the customer service and speed of payout"
        },
        {
            name: "Ted Moralee",
            content: "All one has to do is to look at your investment to see how well it is being looked after."
        },
    ];

    const nextTestimonial = () => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        console.log('Next testimonial clicked');
    };

    const prevTestimonial = () => {
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
        console.log('Previous testimonial clicked');
    };

    return (
        <section className="py-10 md:py-16 bg-[#f5f5f5]">
            <div className="container relative">
                {/* Title */}
                <h2 className="text-center font-serif italic text-tertiary text-2xl md:text-5xl font-bold mb-4 md:mb-8">
                    Hear From Our Customers
                </h2>

                {/* Quote */}
                <p className="max-w-5xl mx-auto text-center text-lg md:text-2xl leading-relaxed text-foreground/80 px-4">
                    {testimonials[currentIndex].content}
                </p>

                {/* Author */}
                <div className="max-w-5xl mx-auto mt-4 md:mt-8 px-4 text-center md:text-left">
                    <div className="italic text-tertiary text-lg md:text-xl font-semibold md:font-medium">
                        {testimonials[currentIndex].name}
                    </div>
                </div>

                {/* Arrows */}
                <button
                    aria-label="Previous testimonial"
                    data-testid="button-prev-testimonial"
                    onClick={prevTestimonial}
                    className="hidden md:block absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-2"
                >
                    <ChevronLeft className="w-10 h-10 text-orange-400" strokeWidth={2.5} />
                </button>

                <button
                    aria-label="Next testimonial"
                    data-testid="button-next-testimonial"
                    onClick={nextTestimonial}
                    className="hidden md:block absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-2"
                >
                    <ChevronRight className="w-10 h-10 text-gray-300" strokeWidth={2.5} />
                </button>

                {/* Dots */}
                <div className="mt-8 flex justify-center gap-3">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            data-testid={`button-testimonial-${index}`}
                            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-accent' : 'bg-gray-300'}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}