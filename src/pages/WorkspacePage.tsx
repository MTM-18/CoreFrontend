import PageShell from "../components/layout/PageShell";
import WorkspaceSpaces from "../components/sections/WorkspaceSection/WorkspaceSpaces";
import WorkspaceWhyChoose from "../components/sections/WorkspaceSection/WorkspaceWhyChoose";

export default function WorkspacePage() {
    return (
        <PageShell>
            <div className="min-h-screen bg-core-bg">
                <main>
                    <WorkspaceWhyChoose />
                    <WorkspaceSpaces />
                </main>
            </div>
        </PageShell>
    );
}
