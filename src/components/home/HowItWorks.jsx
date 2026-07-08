
import { homeHowItWorksData } from "../../assets/assets";

export default function HowItWorks() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        How It <span className="text-primary">Works</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Get professional SEO insights in just three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {homeHowItWorksData.map((step, i) => (
                        <div key={step.num} className="text-center">
                            <div className="relative">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-bold text-primary/10 select-none">
                                    {step.num}
                                </div>
                                <div className="size-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                                    {step.icon}
                                </div>
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                            <p className="text-muted-foreground">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
