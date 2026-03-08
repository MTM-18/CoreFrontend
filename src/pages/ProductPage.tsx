import PageShell from "../compnents/layout/PageShell";
import ProgramsPage from "../compnents/sections/CoreProComponents/programPage";

export default function ProductPage() {
    return (
        <PageShell>
            <div className="min-h-screen bg-core-bg">
                <main className="mx-auto max-w-6xl px-4 py-10">
                    <ProgramsPage />
                </main>
            </div>
        </PageShell>
    );
}