import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import "./Landing.css";

function Landing() {
    return (
        <div className="landing-page">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}
export default Landing;