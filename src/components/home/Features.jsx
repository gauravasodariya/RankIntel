
import { homeFeaturesData } from "../../assets/assets";

export default function Features() {
    return (
        <section className="py-24 bg-secondary-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                        Everything You Need to <span className="text-primary">Rank Higher</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Comprehensive SEO analysis powered by AI, real browser rendering, and industry-leading tools.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {homeFeaturesData.map((f) => (
                        <div 
                            key={f.title} 
                            className="bg-card border border-border rounded-3xl p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="text-primary mb-6 p-4 bg-primary/5 rounded-2xl inline-block">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-foreground">{f.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
