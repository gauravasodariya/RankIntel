
import { Link } from "react-router-dom";

export default function RankTracker() {
    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <h1 className="text-2xl sm:text-3xl font-medium text-foreground mb-4">
                    Rank <span className="gradient-text">Tracker</span>
                </h1>
                <p className="text-muted-foreground mb-8">Track your keyword rankings over time (coming soon!)</p>
                <Link to="/dashboard" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-block" style={{ color: "var(--background)" }}>
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
