import PageShell from "../compnents/layout/PageShell";
import Hero from "../compnents/sections/HomePageComponents/Hero";
import AboutSection from "../compnents/sections/HomePageComponents/AboutSection";
import ServiceSection from "../compnents/sections/HomePageComponents/OurServices";
import NewsSection from "../compnents/sections/HomePageComponents/NewsSection";
import TestimonialsSection from "../compnents/sections/HomePageComponents/TestimonialsSection";
import AchievementsSection from "../compnents/sections/HomePageComponents/AchievementSection";

export default function HomePage() {
    return (
        <PageShell>
            <div className="min-h-screen bg-core-bg">
                <main>
                    <Hero />
                    <AchievementsSection />
                    <AboutSection />
                    <ServiceSection />
                    <NewsSection />
                    <TestimonialsSection />
                </main>
            </div>
        </PageShell>
    );}