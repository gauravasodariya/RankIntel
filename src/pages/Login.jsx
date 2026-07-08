import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsLoading(true);
        try {
            await login(email, password);
            toast.success("Logged in successfully!");
            navigate("/dashboard");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-foreground">RankPilot</span>
                    </Link>
                    <h2 className="text-3xl font-bold text-foreground">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link to="/register" className="font-semibold text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            placeholder="you@example.com"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-foreground">
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 pr-12 rounded-xl border border-border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        style={{ color: "var(--background)" }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}
