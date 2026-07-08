
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ScoreGauge from "../components/ScoreGauge";
import IssueCard from "../components/IssueCard";
import { ArrowLeft, Globe, Clock, FileText, Image, Link2, Heading, Tag, AlertCircle, ExternalLink, Type, Search, Download } from "lucide-react";
import axios from "axios";

export default function Report() {
    const { id } = useParams();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("overview");

    const fetchAnalysis = async () => {
        try {
            const res = await axios.get(`/api/audit/${id}`);
            setAnalysis(res.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load report");
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const res = await axios.get(`/api/export/pdf/${id}`, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `seo-report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Failed to download PDF", err);
        }
    };

    const getScoreClass = (s) => {
        if (s >= 80) return "score-good";
        if (s >= 50) return "score-medium";
        return "score-poor";
    };

    const getScoreBgClass = (s) => {
        if (s >= 80) return "score-bg-good";
        if (s >= 50) return "score-bg-medium";
        return "score-bg-poor";
    };

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "coreWebVitals", label: "Core Web Vitals" },
        { id: "issues", label: "Issues" },
        { id: "recommendations", label: "Recommendations" },
    ];

    useEffect(() => {
        (async () => await fetchAnalysis())();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground text-sm">Loading report...</p>
                </div>
            </div>
        );
    }

    if (error || !analysis) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center bg-card border border-border rounded-2xl p-10">
                    <AlertCircle size={48} className="mx-auto text-danger mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">Report Not Found</h2>
                    <p className="text-muted-foreground text-sm mb-6">{error || "This analysis doesn't exist."}</p>
                    <Link to="/dashboard" className="bg-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground inline-block" style={{ color: "var(--background)" }}>
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const warningCount = analysis.issues.filter((i) => i.severity === "warning" || i.severity === "medium").length;
    const infoCount = analysis.issues.filter((i) => i.severity === "info").length;

    return (
        <div className="min-h-screen pt-16 md:pt-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Back + Header */}
                <div className="mb-8">
                    <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                        <ArrowLeft size={16} />
                        Back to Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-medium text-foreground truncate">{new URL(analysis.url).hostname}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary truncate flex items-center gap-1 transition-colors">
                                    {analysis.url}
                                    <ExternalLink size={12} />
                                </a>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-all"
                        >
                            <Download size={16} />
                            Export PDF
                        </button>
                    </div>
                </div>

                {/* Score Hero */}
                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 mb-6" style={{ animationDelay: "100ms" }}>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        {/* Overall Score */}
                        <ScoreGauge score={analysis.score} size={160} strokeWidth={12} label="Overall Score" />

                        {/* Category Scores */}
                        <div className="flex-1 w-full">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: "SEO", value: analysis.seo, icon: <Search size={18} /> },
                                    { label: "Performance", value: analysis.performance, icon: <Clock size={18} /> },
                                    { label: "Accessibility", value: analysis.accessibility, icon: <Globe size={18} /> },
                                    { label: "Best Practices", value: analysis.bestPractices, icon: <Tag size={18} /> },
                                ].map((cat) => (
                                    <div key={cat.label} className={`rounded-xl p-4 border text-center ${getScoreBgClass(cat.value)}`}>
                                        <div className="flex items-center justify-center gap-1.5 mb-2 text-muted-foreground/80">
                                            {cat.icon}
                                            <span className="text-xs font-medium">{cat.label}</span>
                                        </div>
                                        <p className={`text-2xl font-bold ${getScoreClass(cat.value)}`}>{cat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 overflow-x-auto pb-1" style={{ animationDelay: "200ms" }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                            style={activeTab === tab.id ? { color: "var(--background)" } : {}}
                        >
                            {tab.label}
                            {tab.id === "issues" && analysis.issues.length > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-danger/20 text-danger">{analysis.issues.length}</span>}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div key={activeTab}>
                    {activeTab === "overview" && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Issues Summary */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <AlertCircle size={20} className="text-danger" />
                                    Issues Summary
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="severity-warning rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold">{warningCount}</p>
                                        <p className="text-xs mt-1">Warnings</p>
                                    </div>
                                    <div className="severity-info rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold">{infoCount}</p>
                                        <p className="text-xs mt-1">Info</p>
                                    </div>
                                </div>

                                {analysis.issues.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {analysis.issues.slice(0, 3).map((issue, i) => (
                                            <div key={i} className={`p-3 rounded-lg border ${issue.severity === "warning" || issue.severity === "medium" ? "severity-warning" : "severity-info"}`}>
                                                <p className="text-sm">{issue.message}</p>
                                            </div>
                                        ))}
                                        {analysis.issues.length > 3 && (
                                            <button onClick={() => setActiveTab("issues")} className="w-full text-center text-sm text-primary hover:underline py-2">
                                                View all {analysis.issues.length} issues →
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Keywords */}
                            <div className="bg-card border border-border rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Type size={20} className="text-warning" />
                                    Top Keywords
                                </h3>
                                {analysis.keywords.length > 0 ? (
                                    <div className="space-y-2">
                                        {analysis.keywords.map((kw, i) => (
                                            <div key={kw.word} className="flex items-center gap-3">
                                                <span className="text-xs text-gray-500 w-4">{i + 1}</span>
                                                <span className="flex-1 text-sm font-medium">{kw.word}</span>
                                                <span className="text-xs text-gray-400">{kw.count}×</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500">No keyword data available.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === "coreWebVitals" && analysis.coreWebVitals && (
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-6">Core Web Vitals</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: "LCP", value: analysis.coreWebVitals.lcp, status: analysis.coreWebVitals.lcpStatus },
                                    { label: "CLS", value: analysis.coreWebVitals.cls, status: analysis.coreWebVitals.clsStatus },
                                    { label: "INP", value: analysis.coreWebVitals.inp, status: analysis.coreWebVitals.inpStatus },
                                    { label: "FCP", value: analysis.coreWebVitals.fcp },
                                    { label: "TTFB", value: analysis.coreWebVitals.ttfb },
                                ].map((vital) => (
                                    <div key={vital.label} className="bg-muted/50 border border-border rounded-xl p-4 text-center">
                                        <p className="text-xs text-muted-foreground mb-1">{vital.label}</p>
                                        <p className="text-2xl font-bold">{vital.value}</p>
                                        {vital.status && (
                                            <p className={`text-xs mt-1 ${vital.status === "Good" || vital.status === "Excellent" ? "text-success" : "text-warning"}`}>
                                                {vital.status}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === "issues" && (
                        <div>
                            {analysis.issues.length > 0 ? (
                                <>
                                    {/* Issue filters */}
                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                        <span className="text-sm text-muted-foreground">Filter:</span>
                                        <span className="severity-warning px-2.5 py-1 rounded-full text-xs font-semibold">{warningCount} Warnings</span>
                                        <span className="severity-info px-2.5 py-1 rounded-full text-xs font-semibold">{infoCount} Info</span>
                                    </div>
                                    <div className="space-y-3">
                                        {analysis.issues.map((issue, i) => (
                                            <div key={i} className={`p-4 rounded-xl border ${issue.severity === "warning" || issue.severity === "medium" ? "severity-warning" : "severity-info"}`}>
                                                <p className="text-sm">{issue.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                                        <AlertCircle size={32} className="text-success" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">No Issues Found!</h3>
                                    <p className="text-sm text-muted-foreground">Your website is following SEO best practices.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "recommendations" && (
                        <div className="bg-card border border-border rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-6">Recommendations</h3>
                            {analysis.recommendations.length > 0 ? (
                                <ul className="space-y-3">
                                    {analysis.recommendations.map((rec, i) => (
                                        <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent shrink-0">
                                                {i + 1}
                                            </div>
                                            <p className="text-sm">{rec}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No recommendations available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
