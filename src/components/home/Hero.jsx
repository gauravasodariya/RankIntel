
import { SearchIcon, ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const [url, setUrl] = useState("");
    const navigate = useNavigate();

    const handleQuickAnalyze = (e) => {
        e.preventDefault();
        navigate(`/analyze?url=${encodeURIComponent(url)}`);
    };

    return (
        <section className="px-4 py-24 sm:py-32 text-center">
            <div className="max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/5 rounded-full text-xs text-primary mb-8 border border-primary/10">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute bg-primary size-2 rounded-full animate-ping"></div>
                        <div className="bg-primary size-1.5 rounded-full"></div>
                    </div>
                    Powered by Gemini AI & Google PageSpeed Insights
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
                    Analyze Any Website with <span className="text-primary">AI</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
                    Get instant SEO audits, performance scores, keyword analysis, and actionable recommendations to improve your rankings.
                </p>

                {/* URL Input Bar */}
                <form onSubmit={handleQuickAnalyze} className="max-w-2xl mx-auto">
                    <div className="bg-card border border-border rounded-2xl p-2 flex items-center gap-3 shadow-lg">
                        <div className="flex items-center gap-3 flex-1 px-4">
                            <SearchIcon size={20} className="text-muted-foreground shrink-0" />
                            <input 
                                type="text" 
                                value={url} 
                                onChange={(e) => setUrl(e.target.value)} 
                                placeholder="Enter website URL (e.g., example.com)" 
                                className="w-full bg-transparent text-foreground placeholder-muted-foreground outline-none text-base py-3"
                                id="hero-url-input"
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="bg-primary px-8 py-3.5 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity shrink-0 flex items-center gap-2"
                            id="hero-analyze-btn"
                        >
                            Analyze
                            <ArrowRightIcon size={18} />
                        </button>
                    </div>
                </form>

                <p className="text-muted-foreground text-sm mt-6">Free — No credit card required • 5 analyses per day</p>
            </div>
        </section>
    );
}
