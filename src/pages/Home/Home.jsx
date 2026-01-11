import HeroBanner from "../../components/home/HeroBanner";
import PopularContestsSection from "../../components/home/PopularContestsSection";
import WinnerSpotlightSection from "../../components/home/WinnerSpotlightSection";
import WhyContestHubSection from "../../components/home/WhyContestHubSection";
import CategoriesSection from "../../components/home/CategoriesSection";
import HowItWorksSection from "../../components/home/HowItWorksSection";
import StatisticsSection from "../../components/home/StatisticsSection";
import TestimonialsSection from "../../components/home/TestimonialsSection";
import FeaturedCreatorsSection from "../../components/home/FeaturedCreatorsSection";
import FaqSection from "../../components/home/FaqSection";
import CtaSection from "../../components/home/CtaSection";
import BlogSection from "../../components/home/BlogSection";

const Home = () => {
    return (
        <div className="space-y-16">
            <HeroBanner />
            <PopularContestsSection />
            <CategoriesSection />
            <HowItWorksSection />
            <WinnerSpotlightSection />
            <StatisticsSection />
            <TestimonialsSection />
            <FeaturedCreatorsSection />
            <WhyContestHubSection />
            <FaqSection />
            <BlogSection />
            <CtaSection />
        </div>
    );
};

export default Home;

