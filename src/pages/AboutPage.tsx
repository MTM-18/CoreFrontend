import PageShell from "../compnents/layout/PageShell";
import VisionMissionSection from "../compnents/sections/AboutUsComponents/VisionMissionSection";
import OurSectionsTable from "../compnents/sections/AboutUsComponents/ValuesSection";
import DonorsSection from "../compnents/sections/AboutUsComponents/Dononrs";
import PhotoLibrarySection from "../compnents/sections/AboutUsComponents/PhotoLibrarySection";

export default function AboutPage() {
    return (
        <PageShell>
            <div className="min-h-screen bg-core-bg">
                <main>
                    <VisionMissionSection />
                    <OurSectionsTable />
                    <DonorsSection />
                    <PhotoLibrarySection />
                </main>
            </div>
        </PageShell>
    );
}