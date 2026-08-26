import ContactForm from "@/components/contact-form";
import Hero from "@/components/hero";
import AboutSection from "@/components/about";
import Skills from "@/components/skills";
import Projects from "@/components/projects";
import ExperienceTimeline from "@/components/experience";
import EducationTimeline from "@/components/education";
import CertificatesGrid from "@/components/certificates";
import ServicesList from "@/components/services";
import Footer from "@/components/footer";
import CustomSection from "@/components/common/custom-section";
import { getPublicHomepageData } from "@/lib/supabase/public-data";

export default async function HomePage() {
  const { hero, about, socialLink, skills, projects, experiences, education, certificates, services, siteSettings, homepageSections } = await getPublicHomepageData();

  const heroData = hero as {
    headline?: string | null;
    heading?: string | null;
    subheadline?: string | null;
    subHeading?: string | null;
    fullName?: string | null;
    professionalTitle?: string | null;
    primaryButtonText?: string | null;
    ctaLabel?: string | null;
    primaryButtonUrl?: string | null;
    ctaHref?: string | null;
    secondaryButtonText?: string | null;
    secondaryButtonUrl?: string | null;
    showSocialLinks?: boolean | null;
    showAvailabilityBadge?: boolean | null;
    availabilityStatus?: string | null;
    location?: string | null;
    yearsOfExperience?: number | null;
    resumeUrl?: string | null;
    enableResumeDownload?: boolean | null;
    resumeButtonText?: string | null;
    resumeButtonLabel?: string | null;
    heroImageUrl?: string | null;
    backgroundImageUrl?: string | null;
  } | null;

  const subheadline = heroData?.subheadline ?? heroData?.subHeading ?? "A modern portfolio experience tailored for clients and collaborators.";
  const fullName = heroData?.fullName ?? "Your Name";
  const yearsOfExperience = heroData?.yearsOfExperience ?? 5;
  const siteName = siteSettings?.siteTitle ?? fullName;
  const siteDescription = siteSettings?.seoDescription ?? subheadline;

  const socialLinks = [
    socialLink?.facebookUrl,
    socialLink?.githubUrl,
    socialLink?.linkedinUrl,
    socialLink?.xUrl,
    socialLink?.instagramUrl,
    socialLink?.youtubeUrl,
    socialLink?.portfolioUrl,
  ].filter(Boolean) as string[];

  // Ensure lists are non-null to avoid runtime errors during rendering
  const skillsArr = skills ?? [];
  const projectsArr = projects ?? [];
  const experiencesArr = experiences ?? [];
  const educationArr = education ?? [];
  const certificatesArr = certificates ?? [];
  const servicesArr = services ?? [];
  const visibleSections = new Map(homepageSections.map((section) => [section.key, section]));
  const isVisible = (key: string) => visibleSections.get(key)?.isVisible ?? true;
  const orderedSections = [...homepageSections].sort((a, b) => a.sortOrder - b.sortOrder);

  const renderSection = (key: string) => {
    if (!isVisible(key)) return null;
    if (key === "about") return <AboutSection key={key} about={about ?? { tags: [] }} />;
    if (key === "skills") return <Skills key={key} skills={skillsArr} />;
    if (key === "projects") return <Projects key={key} projects={projectsArr} />;
    if (key === "experience") return <ExperienceTimeline key={key} items={experiencesArr} />;
    if (key === "education") return <EducationTimeline key={key} items={educationArr} />;
    if (key === "certificates") return <CertificatesGrid key={key} certificates={certificatesArr} />;
    if (key === "services") return <ServicesList key={key} services={servicesArr} />;
    if (key === "contact") return (
      <section key={key} id="contact" className="section-card mx-auto mt-12 max-w-6xl p-6 text-[#CBD5E1] animate-fade-in-up-delay sm:p-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">LET&apos;S CONNECT</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Have a project in mind?</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">Let&apos;s build something great together.</p>
          <div className="mt-6 h-1 w-28 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 opacity-90" />
        </div>
        <div className="mt-10"><ContactForm siteDescription={siteDescription} socialLinks={socialLinks} /></div>
      </section>
    );
    const customSection = visibleSections.get(key);
    return customSection?.title && customSection.description ? <CustomSection key={key} section={{ key, title: customSection.title, description: customSection.description }} /> : null;
  };

  return (
    <main className="portfolio-shell min-h-screen bg-[#070B12] px-6 py-16 text-zinc-50 sm:px-10 lg:px-16">
      <Hero heroData={heroData ?? {}} socialLinks={socialLinks} projectsCount={projectsArr.length} experienceYears={yearsOfExperience} clientsCount={projectsArr.length} />

      {orderedSections.map((section) => renderSection(section.key))}

      <Footer siteName={siteName} socialLinks={socialLinks} />
    </main>
  );
}
