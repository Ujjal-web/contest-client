import HeroBanner from "../../components/home/HeroBanner";
import PopularContestsSection from "../../components/home/PopularContestsSection";
import WinnerSpotlightSection from "../../components/home/WinnerSpotlightSection";
import WhyContestHubSection from "../../components/home/WhyContestHubSection";

const Home = () => {
    return (
        <div className="space-y-16">
            <HeroBanner />
            <PopularContestsSection />
            <WinnerSpotlightSection />
            <WhyContestHubSection />
        </div>
    );
};

export default Home;

