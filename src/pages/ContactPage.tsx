import PageShell from "../components/layout/PageShell";
// import ContactForm from "../components/sections/ContactUsComponents/ContactFormSection";
import ContactIntroCards from "../components/sections/ContactUsComponents/ContactIntroCards";
import ContactMapSection from "../components/sections/ContactUsComponents/ContactMapSection";
export default function ContactPage() {
    return (
        <PageShell>
            <main>
                <ContactIntroCards />
                <ContactMapSection />

            </main>
        </PageShell>
    );
}
