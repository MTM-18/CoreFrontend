import { Routes, Route, Outlet, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import WorkspacePage from "./pages/WorkspacePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./compnents/layout/Navbar";
import Footer from "./compnents/layout/Footer";
import BackgroundOrbits from "./compnents/layout/BackgroundOrbits";
import StylizedGlobe from "./pages/StylizedGlobe";
import ComingSoonPage from "./pages/ComingSoonPage";



function SiteLayout() {
  return (
    <div className="app-shell min-h-screen flex flex-col text-core-textDark dark:text-core-textLight">
      <BackgroundOrbits />
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
      <Routes>
          <Route path="/" element={<StylizedGlobe />} />

          <Route path="/home" element={<SiteLayout />}>
              <Route index element={<HomePage />} />
              <Route path="product" element={<ProductPage />} />
              <Route path="workspace" element={<WorkspacePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="podcast" element={<ComingSoonPage titleKey="nav.podcast" />} />
              <Route path="reports" element={<ComingSoonPage titleKey="nav.reports" />} />
              <Route path="certificates" element={<ComingSoonPage titleKey="nav.certificates" />} />
              <Route path="blog" element={<ComingSoonPage titleKey="nav.blog" />} />
          </Route>

          <Route path="/product" element={<Navigate to="/home/product" replace />} />
          <Route path="/entrepreneurship" element={<Navigate to="/home/entrepreneurship" replace />} />
          <Route path="/workspace" element={<Navigate to="/home/workspace" replace />} />
          <Route path="/about" element={<Navigate to="/home/about" replace />} />
          <Route path="/contact" element={<Navigate to="/home/contact" replace />} />
          <Route path="/podcast" element={<Navigate to="/home/podcast" replace />} />
          <Route path="/reports" element={<Navigate to="/home/reports" replace />} />
          <Route path="/certificates" element={<Navigate to="/home/certificates" replace />} />
          <Route path="/blog" element={<Navigate to="/home/blog" replace />} />

          <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}