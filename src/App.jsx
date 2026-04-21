import "./App.css";
import emailjs from "@emailjs/browser";
import { useEffect, useRef, useState } from "react";
import * as si from "simple-icons";
import { FaAws, FaLinkedinIn } from "react-icons/fa";
import ReactCountryFlag from "react-country-flag";
import {
  FiMenu,
  FiChevronDown,
  FiChevronUp,
  FiHome,
  FiUser,
  FiCode,
  FiBriefcase,
  FiFolder,
  FiCompass,
  FiMail,
  FiSun,
  FiMoon,
} from "react-icons/fi";

import perfil from "./assets/hero-cutout.png";
import utesaLogo from "./assets/utesa-logo.png";
import awsBadge from "./assets/aws-badge.png";

/* ─────────────────────────────────────
   SIMPLE ICONS
───────────────────────────────────── */
function TechLogo({ slug, size = 24 }) {
  const icon = si[`si${slug}`];
  if (!icon) return null;

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      style={{ width: size, height: size, fill: `#${icon.hex}` }}
      aria-hidden="true"
    >
      <path d={icon.path} />
    </svg>
  );
}

function AwsBrandIcon({ size = 24 }) {
  return <FaAws size={size} color="#FF9900" aria-hidden="true" />;
}

function LinkedinBrandIcon({ size = 24 }) {
  return <FaLinkedinIn size={size} color="#0A66C2" aria-hidden="true" />;
}

/* ─────────────────────────────────────
   LOCAL ICONS
───────────────────────────────────── */
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l9 6 9-6V7H3Zm18 10V9.8l-8.4 5.6a1 1 0 0 1-1.2 0L3 9.8V17h18Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6.6 2h3.1a1 1 0 0 1 1 .83l.5 3.3a1 1 0 0 1-.29.88L8.8 9.15a13.4 13.4 0 0 0 6.05 6.05l2.1-2.08a1 1 0 0 1 .88-.29l3.3.5a1 1 0 0 1 .83 1v3.1a1 1 0 0 1-.9 1 17.8 17.8 0 0 1-15.6-15.6 1 1 0 0 1 1-.9Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a7 7 0 0 1 7 7c0 4.8-5.18 11.16-6.3 12.47a1 1 0 0 1-1.4 0C10.18 20.16 5 13.8 5 9a7 7 0 0 1 7-7Zm0 9.5A2.5 2.5 0 1 0 12 6.5a2.5 2.5 0 0 0 0 5Z" />
    </svg>
  );
}

/* ─────────────────────────────────────
   APP
───────────────────────────────────── */
function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("es");
  const [scrollY, setScrollY] = useState(0);
  const [activeExpTab, setActiveExpTab] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const navMenuRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
      document.documentElement.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .stagger-item"
    );

    elements.forEach((el) => observer.observe(el));

    const staggerGroups = document.querySelectorAll(
      ".services-grid, .projects-text-list, .edu-grid, .stack-text-list, .exp-bullets"
    );

    staggerGroups.forEach((group) => {
      const items = group.querySelectorAll(".stagger-item");
      items.forEach((item, index) => {
        item.style.setProperty("--stagger-index", index);
      });
    });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      alert(
        lang === "es"
          ? "Completa los campos requeridos."
          : "Please complete the required fields."
      );
      return;
    }

    const defaultSubject =
      lang === "es"
        ? "Nuevo mensaje desde mi portafolio"
        : "New message from my portfolio";

    setSending(true);

    try {
      await emailjs.send(
        "service_1ongd2o",
        "template_ybkppfd",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || defaultSubject,
          message: formData.message,
        },
        "jS0ZiUtBnJ_hX8WUN"
      );

      alert(
        lang === "es"
          ? "Mensaje enviado correctamente."
          : "Message sent successfully."
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      alert(
        lang === "es"
          ? "Hubo un error al enviar el mensaje."
          : "There was an error sending the message."
      );
    } finally {
      setSending(false);
    }
  };

  const content = {
    es: {
      navProjects: "Proyectos",
      navServices: "Servicios",
      navExperience: "Experiencia",
      navContact: "Contacto",
      navMenuTitle: "Navegación",
      navHome: "Inicio",
      navAbout: "Herramientas tecnológicas",
      navJourney: "Educación",

      heroEyebrow: "Bienvenido, soy",
      heroName: "Omar Sebastian Rodriguez Reyes",
      heroDescription:
        "Ingeniero Cloud junior con conocimientos en infraestructura AWS, apasionado por la programación y el aprendizaje continuo de nuevas tecnologías. Me enfoco en desarrollar soluciones que impulsen la innovación, la eficiencia y la transformación digital.",
      experienceStat: "8 meses de experiencia",
      btnProjects: "Ver proyectos",
      btnContact: "Contacto",

      stackEyebrow: "Stack",
      toolsTitle: "Herramientas tecnológicas",
      stackSub:
        "Tecnologías con las que construyo soluciones reales, desde diseño hasta infraestructura cloud.",
      awsDesc:
        "Infraestructura escalable, servicios administrados y arquitecturas cloud modernas.",
      awsSkills: [
        { label: "EC2 / S3", pct: 75 },
        { label: "Lambda", pct: 60 },
        { label: "IAM / VPC", pct: 65 },
      ],
      cloudLevel: "Cloud Junior",
      tecnologias: [
        {
          nombre: "React",
          icono: <TechLogo slug="React" />,
          desc: "UIs interactivas y SPAs modernas con React.",
        },
        {
          nombre: "Node.js",
          icono: <TechLogo slug="Nodedotjs" />,
          desc: "Backend y automatización de procesos.",
        },
        {
          nombre: "Figma",
          icono: <TechLogo slug="Figma" />,
          desc: "Diseño UI/UX, prototipos e interfaces.",
        },
        {
          nombre: "Bots",
          icono: null,
          emoji: "🤖",
          desc: "Chatfuel y flujos de automatización conversacional.",
        },
      ],

      servicesTitle: "Servicios",
      serviciosEyebrow: "Oferta",
      servicios: [
        {
          titulo: "Soluciones en la nube",
          desc: "Diseño e implementación de arquitecturas en AWS: EC2, S3, Lambda, IAM y VPC para aplicaciones escalables y seguras.",
        },
        {
          titulo: "Diseño de web",
          desc: "Desarrollo de sitios y aplicaciones web modernas con React, diseño responsivo y experiencia de usuario optimizada.",
        },
        {
          titulo: "Diseño de bots",
          desc: "Creación de bots conversacionales y flujos de automatización con Chatfuel para mejorar la atención al cliente.",
        },
      ],

      projectsEyebrow: "Work",
      projectsTitle: "Mis proyectos",
      projectsSub: "Cosas que he construido, diseñado y automatizado.",
      projectViewLink: "Ver proyecto →",
      proyectos: [
        {
          titulo: "Desarrollo de mi portafolio",
          descripcion:
            "Sitio personal moderno construido con React. Diseño interactivo con animaciones de scroll, modo oscuro/claro, bilingüe ES/EN y formulario de contacto funcional.",
          tags: ["React", "CSS", "Vite", "i18n"],
        },
        {
          titulo: "Calculadora en C#",
          descripcion:
            "Aplicación de escritorio desarrollada en C# con lógica de negocio, operaciones básicas y estructura orientada a objetos.",
          tags: ["C#", "Desktop", "OOP"],
        },
        {
          titulo: "Bot en Chatfuel",
          descripcion:
            "Bot automatizado que mejora flujos de atención al cliente y automatización conversacional para negocios.",
          tags: ["Chatfuel", "Automation", "Bots"],
        },
      ],

      eduEyebrow: "Formación",
      eduTitle: "Educación y Certificaciones",
      educacion: [
        {
          tipo: "universidad",
          nombre: "Universidad Tecnológica de Santiago",
          titulo: "Ingeniería en Sistemas y Computación",
          desc: "Formación en desarrollo de software, redes, bases de datos y arquitectura de sistemas. Enfocado en soluciones tecnológicas innovadoras.",
          periodo: "En curso",
          logo: utesaLogo,
        },
      ],
      certificaciones: [
        {
          nombre: "AWS Cloud Practitioner",
          emisor: "Amazon Web Services",
          desc: "Certificación oficial de AWS que valida conocimientos fundamentales en servicios cloud, arquitectura, seguridad y facturación en la plataforma de Amazon Web Services.",
          año: "2026",
          logo: awsBadge,
        },
      ],

      expEyebrow: "Experience",
      workTitle: "Experiencia laboral",
      laboral: [
        {
          empresa: "Methodica Technology & Co",
          cargo: "Cloud Engineer Jr.",
          tiempo: "Actualidad",
          current: true,
          bullets: [
            "Desarrollo de <strong>bots automatizados</strong> para procesos de atención al cliente y flujos conversacionales.",
            "Participación activa en el <strong>crecimiento tecnológico</strong> de la empresa y sus clientes.",
            "Apoyo en <strong>infraestructura cloud</strong> y soluciones digitales innovadoras.",
          ],
          skills: ["Chatfuel", "Automatización", "Cloud", "AWS", "React"],
        },
        {
          empresa: "Jam Construcciones",
          cargo: "Pasante",
          tiempo: "1 año",
          current: false,
          bullets: [
            "Apoyo en el <strong>departamento de contabilidad</strong>, gestión de registros financieros y reportes.",
            "Manejo de <strong>documentación</strong> y soporte en procesos administrativos internos.",
          ],
          skills: ["Contabilidad", "Administración", "Office", "Excel"],
        },
      ],

      contactTitle: "Diseñemos juntos",
      contactSubtitle:
        "¿Tienes un proyecto en mente? Colaboremos y creemos algo increíble.",
      contactLeadTitle: "Ponte en contacto",
      contactLeadText:
        "Siempre estoy abierto a discutir nuevos proyectos, ideas creativas u oportunidades para ser parte de tus visiones. ¡No dudes en contactarme!",
      nameLabel: "Tu nombre",
      emailLabel: "Email",
      subjectLabel: "Asunto",
      messageLabel: "Mensaje",
      namePlaceholder: "Tu nombre",
      emailPlaceholder: "example@gmail.com",
      subjectPlaceholder: "Quiero trabajar contigo porque...",
      messagePlaceholder: "Cuéntame sobre tu proyecto o idea...",
      sendButton: "Enviar mensaje",
      sendNote: "Este formulario enviará el mensaje directamente a mi correo.",
      email: "Correo",
      phone: "Teléfono",
      location: "Ubicación",

      footerText: "Diseñado y construido por",

      modeDark: "Modo oscuro",
      modeLight: "Modo claro",
    },

    en: {
      navProjects: "Projects",
      navServices: "Services",
      navExperience: "Experience",
      navContact: "Contact",
      navMenuTitle: "Navigation",
      navHome: "Home",
      navAbout: "About me",
      navJourney: "Journey",

      heroEyebrow: "Welcome, I'm",
      heroName: "Omar Sebastian Rodriguez Reyes",
      heroDescription:
        "Junior Cloud Engineer with AWS infrastructure knowledge, passionate about programming and continuously learning new technologies. I focus on developing solutions that drive innovation, efficiency, and digital transformation.",
      experienceStat: "8 months of experience",
      btnProjects: "View projects",
      btnContact: "Contact",

      stackEyebrow: "Stack",
      toolsTitle: "Technology stack",
      stackSub:
        "Technologies I use to build real solutions, from design to cloud infrastructure.",
      awsDesc:
        "Scalable infrastructure, managed services and modern cloud architectures.",
      awsSkills: [
        { label: "EC2 / S3", pct: 75 },
        { label: "Lambda", pct: 60 },
        { label: "IAM / VPC", pct: 65 },
      ],
      cloudLevel: "Cloud Junior",
      tecnologias: [
        {
          nombre: "React",
          icono: <TechLogo slug="React" />,
          desc: "Interactive UIs and modern SPAs with React.",
        },
        {
          nombre: "Node.js",
          icono: <TechLogo slug="Nodedotjs" />,
          desc: "Backend development and process automation.",
        },
        {
          nombre: "Figma",
          icono: <TechLogo slug="Figma" />,
          desc: "UI/UX design, prototypes and interfaces.",
        },
        {
          nombre: "Bots",
          icono: null,
          emoji: "🤖",
          desc: "Chatfuel and conversational automation flows.",
        },
      ],

      servicesTitle: "Services",
      serviciosEyebrow: "Offer",
      servicios: [
        {
          titulo: "Cloud solutions",
          desc: "Design and implementation of AWS architectures: EC2, S3, Lambda, IAM and VPC for scalable and secure applications.",
        },
        {
          titulo: "Web design",
          desc: "Development of modern websites and web apps with React, responsive design and optimized user experience.",
        },
        {
          titulo: "Bot design",
          desc: "Creation of conversational bots and automation flows with Chatfuel to improve customer service.",
        },
      ],

      projectsEyebrow: "Work",
      projectsTitle: "My projects",
      projectsSub: "Things I've built, designed and automated.",
      projectViewLink: "View project →",
      proyectos: [
        {
          titulo: "Portfolio development",
          descripcion:
            "Modern personal site built with React. Interactive design with scroll animations, dark/light mode, bilingual ES/EN support and a functional contact form.",
          tags: ["React", "CSS", "Vite", "i18n"],
        },
        {
          titulo: "C# Calculator",
          descripcion:
            "Desktop application developed in C# with business logic, basic operations and an object-oriented structure.",
          tags: ["C#", "Desktop", "OOP"],
        },
        {
          titulo: "Chatfuel Bot",
          descripcion:
            "Automated bot that improves customer service flows and conversational automation for businesses.",
          tags: ["Chatfuel", "Automation", "Bots"],
        },
      ],

      eduEyebrow: "Formation",
      eduTitle: "Education & Certifications",
      educacion: [
        {
          tipo: "universidad",
          nombre: "Universidad Tecnológica de Santiago",
          titulo: "Systems and Computer Engineering",
          desc: "Training in software development, networking, databases and systems architecture. Focused on innovative technological solutions.",
          periodo: "In progress",
          logo: utesaLogo,
        },
      ],
      certificaciones: [
        {
          nombre: "AWS Cloud Practitioner",
          emisor: "Amazon Web Services",
          desc: "Official AWS certification validating foundational knowledge of cloud services, architecture, security and billing on the Amazon Web Services platform.",
          año: "2026",
          logo: awsBadge,
        },
      ],

      expEyebrow: "Experience",
      workTitle: "Work experience",
      laboral: [
        {
          empresa: "Methodica Technology & Co",
          cargo: "Cloud Engineer Jr.",
          tiempo: "Present",
          current: true,
          bullets: [
            "Development of <strong>automated bots</strong> for customer service processes and conversational flows.",
            "Active participation in the <strong>technological growth</strong> of the company and its clients.",
            "Support in <strong>cloud infrastructure</strong> and innovative digital solutions.",
          ],
          skills: ["Chatfuel", "Automation", "Cloud", "AWS", "React"],
        },
        {
          empresa: "Jam Construcciones",
          cargo: "Intern",
          tiempo: "1 year",
          current: false,
          bullets: [
            "Support in the <strong>accounting department</strong>, managing financial records and reports.",
            "Handling of <strong>documentation</strong> and support in internal administrative processes.",
          ],
          skills: ["Accounting", "Administration", "Office", "Excel"],
        },
      ],

      contactTitle: "Let's design together",
      contactSubtitle:
        "Do you have a project in mind? Let's collaborate and create something incredible.",
      contactLeadTitle: "Get in touch",
      contactLeadText:
        "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to contact me.",
      nameLabel: "Your Name",
      emailLabel: "Email",
      subjectLabel: "Subject",
      messageLabel: "Message",
      namePlaceholder: "Your name",
      emailPlaceholder: "example@gmail.com",
      subjectPlaceholder: "I want to work with you because...",
      messagePlaceholder: "Tell me about your project or idea...",
      sendButton: "Send message",
      sendNote: "This form sends the message directly to my email inbox.",
      email: "Email",
      phone: "Phone",
      location: "Location",

      footerText: "Designed and built by",

      modeDark: "Dark mode",
      modeLight: "Light mode",
    },
  };

  const t = content[lang];

  const navItems = [
    { href: "#inicio", label: t.navHome, icon: FiHome },
    { href: "#stack", label: t.navAbout, icon: FiUser },
    { href: "#servicios", label: t.navServices, icon: FiCode },
    { href: "#laboral", label: t.navExperience, icon: FiBriefcase },
    { href: "#proyectos", label: t.navProjects, icon: FiFolder },
    { href: "#educacion", label: t.navJourney, icon: FiCompass },
    { href: "#contacto", label: t.navContact, icon: FiMail },
  ];

  return (
    <div className={`portfolio theme-${theme}`}>
      <div
        className="cursor-glow"
        style={{ left: mousePosition.x, top: mousePosition.y }}
      />

      <div className="background-blobs">
        <span className="blob blob-1"></span>
        <span className="blob blob-2"></span>
        <span className="blob blob-3"></span>
      </div>

      <nav className="topbar-shell">
        <div className="topbar">
          <a
            href="#inicio"
            className="topbar-brand"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
              setMenuOpen(false);
            }}
          >
            <div className="topbar-brand-logo">
              <img
                src="/logo.png"
                alt="Logo Omar Rodriguez"
                className="topbar-brand-logo-img"
              />
            </div>

            <div className="topbar-brand-text">
              <span className="topbar-brand-name">Omar Rodriguez</span>
              <span className="topbar-brand-role">Cloud Engineer</span>
            </div>
          </a>

          <div className="topbar-center">
            <div className="nav-pill-menu" ref={navMenuRef}>
              <button
                className={`nav-pill-trigger ${menuOpen ? "open" : ""}`}
                onClick={() => setMenuOpen((prev) => !prev)}
                type="button"
                aria-expanded={menuOpen}
                aria-label={t.navMenuTitle}
              >
                <span className="nav-pill-trigger-left">
                  <FiMenu className="nav-pill-main-icon" />
                  <span>{t.navMenuTitle}</span>
                </span>

                {menuOpen ? (
                  <FiChevronUp className="nav-pill-chevron" />
                ) : (
                  <FiChevronDown className="nav-pill-chevron" />
                )}
              </button>

              <div className={`nav-pill-panel ${menuOpen ? "show" : ""}`}>
                {navItems.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={index}
                      href={item.href}
                      className="nav-pill-item"
                      onClick={(e) => {
                        if (item.href === "#inicio") {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                        setMenuOpen(false);
                      }}
                    >
                      <span className="nav-pill-item-icon">
                        <Icon />
                      </span>
                      <span>{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="topbar-right">
            <span className="topbar-divider" aria-hidden="true"></span>

            <button
              className="lang-switch"
              onClick={() => setLang(lang === "es" ? "en" : "es")}
              type="button"
              aria-label={
                lang === "es" ? "Switch to English" : "Cambiar a español"
              }
            >
              <span className="lang-switch-flag" aria-hidden="true">
                {lang === "es" ? (
                  <ReactCountryFlag
                    countryCode="DO"
                    svg
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  />
                ) : (
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      overflow: "hidden",
                    }}
                  />
                )}
              </span>
              <span className="lang-switch-text">
                {lang === "es" ? "ES" : "EN"}
              </span>
              <FiChevronDown />
            </button>

            <button
              className="theme-switch"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
              aria-label={theme === "dark" ? t.modeLight : t.modeDark}
              title={theme === "dark" ? t.modeLight : t.modeDark}
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
          </div>
        </div>
      </nav>

      <header className="hero reveal" id="inicio">
        <div
          className="hero-copy"
          style={{
            transform: `translateY(${Math.min(scrollY * 0.08, 40)}px)`,
            opacity: `${Math.max(1 - scrollY / 900, 0.45)}`,
          }}
        >
          <p className="hero-intro">{t.heroEyebrow}</p>
          <h1>
            <span className="hero-name-first">Omar Sebastian</span>
            <span className="hero-name-last">Rodriguez Reyes</span>
          </h1>
          <p className="hero-description">{t.heroDescription}</p>

          <div className="hero-badges">
            <span className="hero-badge-stat">{t.experienceStat}</span>
          </div>

          <div className="hero-buttons">
            <a href="#proyectos" className="btn btn-primary">
              {t.btnProjects}
            </a>
            <a href="#contacto" className="btn btn-secondary">
              {t.btnContact}
            </a>
          </div>

          <div className="social-links">
            <a
              className="social-link"
              href="https://www.instagram.com/omar.s.r.r?igsh=emhjMXB4ZGY2ZWE%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <TechLogo slug="Instagram" />
            </a>
            <a
              className="social-link"
              href="https://www.linkedin.com/in/omar-sebastian-rodriguez-reyes-2208a0387/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <LinkedinBrandIcon />
            </a>
            <a
              className="social-link"
              href="https://github.com/tuusuario"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <TechLogo slug="Github" />
            </a>
            <a
              className="social-link"
              href="https://wa.me/18492678020"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <TechLogo slug="Whatsapp" />
            </a>
          </div>
        </div>

        <div
          className="hero-right"
          style={{ transform: `translateY(${Math.min(scrollY * 0.04, 24)}px)` }}
        >
          <div className="hero-photo-block">
            <span className="photo-deco-dot"></span>
            <span className="photo-deco-plus">+</span>
            <span className="photo-deco-line"></span>
            <span className="photo-deco-wave">〰</span>
            <span className="photo-deco-triangle">△</span>

            <span className="photo-star star-1"></span>
            <span className="photo-star star-2"></span>
            <span className="photo-star star-3"></span>
            <span className="photo-star star-4"></span>

            <span className="photo-planet planet-1"></span>
            <span className="photo-planet planet-2"></span>

            <div className="photo-frame">
              <div className="photo-ring">
                <img
                  src={perfil}
                  alt="Foto de Omar Sebastian Rodriguez Reyes"
                />
              </div>
            </div>

            <div className="photo-role-badge">Cloud Engineer · AWS</div>
          </div>
        </div>
      </header>

      <section className="section reveal" id="stack">
        <div className="section-head reveal">
          <div className="section-eyebrow">{t.stackEyebrow}</div>
          <h2>{t.toolsTitle}</h2>
          <div className="section-underline"></div>
          <p className="section-sub">{t.stackSub}</p>
        </div>

        <div className="stack-text-wrap">
          <div className="stack-text-lead reveal-left">
            <div className="stack-text-lead-head">
              <span className="stack-text-lead-icon">
                <AwsBrandIcon />
              </span>
              <div>
                <div className="stack-text-kicker">AWS Cloud</div>
                <h3 className="stack-text-title">{t.cloudLevel}</h3>
              </div>
            </div>

            <p className="stack-text-desc">{t.awsDesc}</p>

            <div className="stack-meters">
              {t.awsSkills.map((s, i) => (
                <div className="stack-meter" key={i}>
                  <div className="stack-meter-top">
                    <span>{s.label}</span>
                    <span>{s.pct}%</span>
                  </div>
                  <div className="stack-meter-track">
                    <div
                      className="stack-meter-fill"
                      style={{ "--target-width": `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="stack-text-list reveal-right">
            {t.tecnologias.map((item, index) => (
              <div className="stack-text-item stagger-item" key={index}>
                <div className="stack-text-item-head">
                  <span className="stack-text-item-index">0{index + 1}</span>

                  <span className="stack-text-icon">
                    {item.icono ? (
                      item.icono
                    ) : (
                      <span className="bc-icon-emoji">{item.emoji}</span>
                    )}
                  </span>

                  <div className="stack-text-item-main">
                    <h3>{item.nombre}</h3>
                    <p>{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="servicios">
        <div className="section-head centered">
          <div className="section-eyebrow">{t.serviciosEyebrow}</div>
          <h2>{t.servicesTitle}</h2>
          <div className="section-underline"></div>
        </div>

        <div className="services-grid">
          {t.servicios.map((item, index) => (
            <div className="service-card stagger-item" key={index}>
              <div className="card-line"></div>
              <h3>{item.titulo}</h3>
              <p className="service-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal" id="proyectos">
        <div className="section-head reveal">
          <div className="section-eyebrow">{t.projectsEyebrow}</div>
          <h2>{t.projectsTitle}</h2>
          <div className="section-underline"></div>
          <p className="section-sub">{t.projectsSub}</p>
        </div>

        <div className="projects-text-list">
          {t.proyectos.map((proyecto, index) => (
            <article className="project-text-row stagger-item" key={index}>
              <div className="project-text-left">
                <div className="project-text-number">0{index + 1}</div>
                <h3 className="project-text-title">{proyecto.titulo}</h3>
              </div>

              <div className="project-text-right">
                <p className="project-text-desc">{proyecto.descripcion}</p>

                <div className="project-text-tags">
                  {proyecto.tags.map((tag, i) => (
                    <span className="project-text-tag" key={i}>
                      {tag}
                    </span>
                  ))}
                </div>

                {index === 0 && (
                  <a className="project-text-link" href="#contacto">
                    {t.projectViewLink}
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section reveal" id="laboral">
        <div className="section-head reveal">
          <div className="section-eyebrow">{t.expEyebrow}</div>
          <h2>{t.workTitle}</h2>
          <div className="section-underline"></div>
        </div>

        <div className="exp-wrap">
          <div className="exp-tabs">
            {t.laboral.map((item, index) => (
              <div
                key={index}
                className={`exp-tab ${activeExpTab === index ? "active" : ""}`}
                onClick={() => setActiveExpTab(index)}
              >
                <div className="exp-tab-name">{item.empresa}</div>
                <div className="exp-tab-period">{item.tiempo}</div>
              </div>
            ))}
          </div>

          <div>
            {t.laboral.map((item, index) => (
              <div
                key={index}
                className={`exp-panel ${
                  activeExpTab === index ? "active" : ""
                }`}
              >
                <div className="exp-header">
                  <div className="exp-role">{item.cargo}</div>
                  <div className="exp-company">{item.empresa}</div>
                  <div className={`exp-badge ${item.current ? "" : "past"}`}>
                    {item.tiempo}
                  </div>
                </div>

                <div className="exp-bullets">
                  {item.bullets.map((bullet, i) => (
                    <div className="exp-bullet" key={i}>
                      <div className="exp-bullet-dot"></div>
                      <span
                        className="exp-bullet-text"
                        dangerouslySetInnerHTML={{ __html: bullet }}
                      />
                    </div>
                  ))}
                </div>

                <div className="exp-skills">
                  {item.skills.map((skill, i) => (
                    <span className="exp-skill-tag" key={i}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section reveal" id="educacion">
        <div className="section-head centered reveal">
          <div className="section-eyebrow">{t.eduEyebrow}</div>
          <h2>{t.eduTitle}</h2>
          <div className="section-underline"></div>
        </div>

        <div className="edu-grid">
          {t.educacion.map((item, index) => (
            <div className="edu-card stagger-item" key={index}>
              <div className="edu-card-logo-wrap">
                <img
                  src={item.logo || utesaLogo}
                  alt={item.nombre}
                  className="edu-card-logo"
                />
              </div>
              <div className="edu-card-body">
                <div className="edu-card-badge">{item.periodo}</div>
                <div className="edu-card-name">{item.nombre}</div>
                <div className="edu-card-title">{item.titulo}</div>
                <p className="edu-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}

          {t.certificaciones.map((item, index) => (
            <div className="edu-card cert-card stagger-item" key={index}>
              <div className="edu-card-logo-wrap">
                <img
                  src={item.logo || awsBadge}
                  alt={item.nombre}
                  className="edu-card-logo aws-badge-logo"
                />
              </div>
              <div className="edu-card-body">
                <div className="edu-card-badge cert-badge">{item.año}</div>
                <div className="edu-card-name">{item.nombre}</div>
                <div className="edu-card-title">{item.emisor}</div>
                <p className="edu-card-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section contact-section reveal" id="contacto">
        <div className="contact-section-header">
          <h2>{t.contactTitle}</h2>
          <div
            className="section-underline"
            style={{ margin: "12px auto 0" }}
          ></div>
          <p>{t.contactSubtitle}</p>
        </div>

        <div className="contact-layout">
          <div className="contact-info-panel reveal-left">
            <h3>{t.contactLeadTitle}</h3>
            <p>{t.contactLeadText}</p>

            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="contact-icon-box">
                  <MailIcon />
                </div>
                <div>
                  <span className="contact-item-label">{t.email}</span>
                  <span className="contact-item-value">
                    sebastianomarrodriguezreyes@gmail.com
                  </span>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-box">
                  <PhoneIcon />
                </div>
                <div>
                  <span className="contact-item-label">{t.phone}</span>
                  <span className="contact-item-value">+1 (849) 267-8020</span>
                </div>
              </div>

              <div className="contact-info-item">
                <div className="contact-icon-box">
                  <LocationIcon />
                </div>
                <div>
                  <span className="contact-item-label">{t.location}</span>
                  <span className="contact-item-value">Santo Domingo, RD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-panel reveal-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="name">
                  {t.nameLabel}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-input"
                  placeholder={t.namePlaceholder}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  {t.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  placeholder={t.emailPlaceholder}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">
                  {t.subjectLabel}
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="form-input"
                  placeholder={t.subjectPlaceholder}
                  value={formData.subject}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  {t.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder={t.messagePlaceholder}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="contact-submit"
                disabled={sending}
              >
                {sending
                  ? lang === "es"
                    ? "Enviando..."
                    : "Sending..."
                  : t.sendButton}
              </button>
              <p className="contact-note">{t.sendNote}</p>
            </form>
          </div>
        </div>
      </section>

      <footer className="footer reveal">
        <div className="footer-left">
          {t.footerText} <span>Omar Sebastian Rodriguez Reyes</span> ©{" "}
          {new Date().getFullYear()}
        </div>

        <div className="footer-socials">
          <a
            className="footer-social"
            href="https://www.instagram.com/omar.s.r.r?igsh=emhjMXB4ZGY2ZWE%3D&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <TechLogo slug="Instagram" />
          </a>
          <a
            className="footer-social"
            href="https://www.linkedin.com/in/omar-sebastian-rodriguez-reyes-2208a0387/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedinBrandIcon />
          </a>
          <a
            className="footer-social"
            href="https://github.com/tuusuario"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <TechLogo slug="Github" />
          </a>
          <a
            className="footer-social"
            href="https://wa.me/18492678020"
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp"
          >
            <TechLogo slug="Whatsapp" />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;