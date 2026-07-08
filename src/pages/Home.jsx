
import Footer from "../components/home/Footer";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import Pricing from "../components/home/Pricing";

export default function Home() {
    return (
        <div>
            <Hero />
            <Features />
            <HowItWorks />
            <Pricing />
            <Footer />
        </div>
    );
}
