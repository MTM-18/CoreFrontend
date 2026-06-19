import PageShell from "../components/layout/PageShell";
import Hero from "../components/sections/HomePageComponents/Hero";
import AboutSection from "../components/sections/HomePageComponents/AboutSection";
import ServiceSection from "../components/sections/HomePageComponents/OurServices";
import NewsSection from "../components/sections/HomePageComponents/NewsSection";
import TestimonialsSection from "../components/sections/HomePageComponents/TestimonialsSection";
import AchievementsSection from "../components/sections/HomePageComponents/AchievementSection";

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