import PageShell from "../compnents/layout/PageShell";
import WorkspaceHero from "../compnents/sections/WorkspaceSection/WorkspaceHero";
import WorkspaceSpaces from "../compnents/sections/WorkspaceSection/WorkspaceSpaces";
import WorkspaceWhyChoose from "../compnents/sections/WorkspaceSection/WorkspaceWhyChoose";

export default function WorkspacePage() {
    return (
        <PageShell>
            <div className="min-h-screen bg-core-bg">
                <main>
                    <WorkspaceHero />
                    <WorkspaceWhyChoose />
                    <WorkspaceSpaces />
                </main>
            </div>
        </PageShell>
    );
}