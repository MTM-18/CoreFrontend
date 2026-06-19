import PageShell from "../components/layout/PageShell";
import VisionMissionSection from "../components/sections/AboutUsComponents/VisionMissionSection";
import OurSectionsTable from "../components/sections/AboutUsComponents/ValuesSection";
import DonorsSection from "../components/sections/AboutUsComponents/Dononrs";
import PhotoLibrarySection from "../components/sections/AboutUsComponents/PhotoLibrarySection";
import TeamSection from "../components/sections/AboutUsComponents/TeamSection";
import SdgSection from "../components/sections/AboutUsComponents/SdgSection";

export default function AboutPage() {
    return (
        <PageShell>
            <div className="min-h-screen bg-core-bg">
                <main>
                    <VisionMissionSection />
                    <OurSectionsTable />
                    <SdgSection />
                    <TeamSection />
                    <DonorsSection />
                    <PhotoLibrarySection />
                </main>
            </div>
        </PageShell>
    );
}
