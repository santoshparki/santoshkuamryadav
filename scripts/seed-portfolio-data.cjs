require("dotenv").config({ path: ".env.local" });

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
const pg = require("pg");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 2 });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool, { disposeExternalPool: false }) });

async function upsertSkill(category, name, description, sortOrder) {
  const existing = await prisma.skill.findFirst({ where: { categoryId: category.id, name } });
  return existing
    ? prisma.skill.update({ where: { id: existing.id }, data: { description, sortOrder } })
    : prisma.skill.create({ data: { categoryId: category.id, name, description, sortOrder } });
}

async function main() {
  const heroData = {
    fullName: "Santosh Kumar Yadav",
    professionalTitle: "Electrical & Electronics Engineer",
    headline: "Electrical & Electronics Engineer building practical, reliable power and embedded systems.",
    subheadline:
      "Certified Electrical and Electronics Engineering graduate focused on power systems, control systems, renewable energy, embedded systems, and modern technical solutions.",
    heading: "Electrical & Electronics Engineer building practical, reliable power and embedded systems.",
    subHeading:
      "Certified Electrical and Electronics Engineering graduate focused on power systems, control systems, renewable energy, embedded systems, and modern technical solutions.",
    location: "Kathmandu, Nepal",
    yearsOfExperience: 2,
    showAvailabilityBadge: true,
    availabilityStatus: "Available for engineering opportunities",
  };
  const hero = await prisma.hero.findFirst();
  if (hero) await prisma.hero.update({ where: { id: hero.id }, data: heroData });
  else await prisma.hero.create({ data: heroData });

  let user = await prisma.user.findFirst();
  if (!user) user = await prisma.user.create({ data: { email: "admin@example.com", fullName: "Santosh Kumar Yadav" } });
  const aboutData = {
    sectionTitle: "Professional Summary",
    sectionSubtitle: "Electrical & Electronics Engineer",
    shortBio:
      "Electrical and Electronics Engineering graduate with hands-on experience in electrical systems, technical documentation, power electronics, and embedded solutions.",
    longBio:
      "As a certified Electrical and Electronics Engineering graduate from Nepal, I am eager to expand my knowledge in power systems, signal systems, control systems, power electronics, renewable energy, microprocessors, microcontrollers, and programming. I am passionate about solving real-world problems through innovative ideas and modern technological solutions.",
  };
  const about = await prisma.about.findFirst();
  if (about) await prisma.about.update({ where: { id: about.id }, data: aboutData });
  else await prisma.about.create({ data: { userId: user.id, ...aboutData } });

  const experiences = [
    {
      company: "Prime Steel Pvt. Ltd., Birgunj",
      position: "Trainee Electrical Engineer",
      description:
        "Supported the operation, monitoring, and troubleshooting of plant electrical systems. Participated in breakdown maintenance of power systems under senior engineers. Ensured compliance with electrical safety standards and regulations. Maintained maintenance records, logs, and documentation while coordinating with mechanical teams.",
      startDate: new Date("2026-03-01"),
      endDate: null,
      isCurrent: true,
      sortOrder: 0,
    },
    {
      company: "Entegra",
      position: "Technical Writer (Electrical & Electronics)",
      description:
        "Created technical documentation, manuals, and datasheets. Interpreted circuit diagrams and PCB layouts, collaborated with engineering teams to gather technical information, and translated technical data into clear English documentation.",
      startDate: new Date("2024-08-01"),
      endDate: new Date("2024-12-31"),
      isCurrent: false,
      sortOrder: 1,
    },
  ];
  for (const data of experiences) {
    const existing = await prisma.experience.findFirst({ where: { company: data.company, position: data.position } });
    if (existing) await prisma.experience.update({ where: { id: existing.id }, data });
    else await prisma.experience.create({ data });
  }

  const education = {
    institution: "Jain Deemed To Be University, Bangalore",
    degree: "Bachelor of Technology in Electrical & Electronics Engineering",
    description: "CGPA: 8.0/10. Final Project: Solar-Based Wireless Charging System for Electric Vehicles.",
    sortOrder: 0,
  };
  const existingEducation = await prisma.education.findFirst({ where: { institution: education.institution, degree: education.degree } });
  if (existingEducation) await prisma.education.update({ where: { id: existingEducation.id }, data: education });
  else await prisma.education.create({ data: education });

  const skillGroups = {
    "Electrical Engineering": ["Circuit Analysis (AC/DC)", "Electrical Machines", "Power Systems", "Analog & Digital Electronics", "Microprocessors & Microcontrollers", "Control Systems", "Power Electronics", "Signal Processing", "Embedded Systems Development"],
    "Software & Tools": ["MATLAB/Simulink", "PCB Design", "Microsoft Excel", "Microsoft Word", "Microsoft PowerPoint"],
    Programming: ["Python", "Java", "HTML", "CSS", "Arduino", "Embedded C", "C/C++"],
    "Professional Skills": ["Technical Documentation", "Communication & Teamwork", "Adaptability & Fast Learning", "Time Management", "Project Coordination"],
  };
  let categoryOrder = 0;
  for (const [name, skills] of Object.entries(skillGroups)) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const category = await prisma.skillCategory.upsert({ where: { slug }, update: { name, sortOrder: categoryOrder }, create: { name, slug, sortOrder: categoryOrder } });
    await Promise.all(skills.map((skill, index) => upsertSkill(category, skill, null, index)));
    categoryOrder += 1;
  }

  const projects = [
    {
      title: "Solar-Based Wireless Charging System for Electric Vehicles",
      slug: "solar-based-wireless-charging-system-for-electric-vehicles",
      shortDescription: "A solar-powered wireless EV charging prototype using inductive coupling, MPPT, and embedded control.",
      description:
        "Project Lead. Designed a wireless EV charging system using inductive coupling for efficient contactless power transfer. Implemented solar power integration with an MPPT controller to maximize energy harvesting, developed Arduino/STM32 PWM control for precise power regulation, and documented circuit schematics, testing, and results.",
      category: "Renewable Energy & Embedded Systems",
      status: "PUBLISHED",
      featured: true,
      technologies: ["Solar panels", "MPPT", "Arduino", "STM32", "Embedded C", "PWM"],
    },
    {
      title: "Load Shedding Time Management with Programmable Interface",
      slug: "load-shedding-time-management-with-programmable-interface",
      shortDescription: "An automated load-shedding scheduler with real-time controls and programmable electrical switching.",
      description:
        "Project Planner. Developed an automated load-shedding scheduler to manage power distribution during outage periods. Programmed precise timing with a real-time clock module, designed an LCD and keypad interface for configuration, and integrated relay switching for reliable automated electrical-load control.",
      category: "Embedded Systems",
      status: "PUBLISHED",
      featured: true,
      technologies: ["Arduino Uno", "RTC", "Relay Module", "LCD", "Keypad", "C/C++"],
    },
  ];
  for (const data of projects) await prisma.project.upsert({ where: { slug: data.slug }, update: data, create: data });

  const achievements = [
    "The Spark Club Member (Treasurer)",
    "National Service Scheme (NSS) Member",
    "Khelo India University Games Volunteer",
    "Volunteered in interschool sports events, supporting coordination and smooth execution of activities",
    "Study in India Scholarship (100%) - MHRD, Government of India",
  ];
  for (const [index, title] of achievements.entries()) {
    const existing = await prisma.certificate.findFirst({ where: { title } });
    const data = { title, issuer: "Achievements & Activities", description: "Portfolio achievement", sortOrder: index };
    if (existing) await prisma.certificate.update({ where: { id: existing.id }, data });
    else await prisma.certificate.create({ data });
  }

  console.log("Portfolio data seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
