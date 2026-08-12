
"use client";

import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaGithub, FaExternalLinkAlt, FaTimes, FaCheck, FaShieldAlt, FaRocket } from "react-icons/fa";
import BorderGlow from "../BorderGlow";
import "./Projects.css";

const projectsData = [
  {
    title: "Hotel Booking Platform",
    image: "/bookinglk1.png",
    description: "BookingLK is a modern full-stack hotel booking web application that enables users to explore and book hotels across Sri Lanka. The platform features hotel search, detailed property listings, real-time booking, and email confirmation for reservations. Built with Next.js, React, and TypeScript, the application uses MongoDB Atlas as the database and Next.js API Routes for backend services. The interface is designed with Tailwind CSS, CSS Modules, and Framer Motion to provide a responsive and engaging user experience.",
    overview: "A full-stack hotel booking platform that connects travelers with accommodations across Sri Lanka. The system handles user authentication, property management, real-time booking, payment processing, and email confirmations.",
    features: [
      "User Authentication & Authorization",
      "Hotel Search & Filtering",
      "Real-time Booking System",
      "Email Confirmation",
      "Property Management Dashboard",
      "Responsive UI with Tailwind CSS",
      "Secure Payment Integration",
      "Admin Panel for Hotel Owners",
      "Booking History & Management"
    ],
    tech: ["Next.js", "TypeScript", "MongoDB", "Tailwind", "Framer Motion", "JWT Authentication"],
    security: [
      "JWT Authentication",
      "Password Hashing with bcrypt",
      "Protected API Routes",
      "Role-Based Access Control",
      "Input Validation & Sanitization",
      "MongoDB Schema Validation"
    ],
    performance: [
      "Server-Side Rendering (SSR)",
      "Image Optimization",
      "Fast Loading Times",
      "Reusable Components",
      "Scalable Architecture",
      "Optimized Database Queries"
    ],
    status: "Completed • Live • Maintained",
    github: "https://github.com/Zashiyh/bookinglkapi",
     demo: "https://bookinglk2-0-kzfl-five.vercel.app/",
    
    number: "01"
  },
  {
    title: "Traveler App",
    image: "/traveler.png",
    description: "Traveler is a modern travel social media mobile application developed using Android Studio and Jetpack Compose. The app allows users to share travel experiences, upload photos, explore destinations, and interact with other travelers. It features Firebase Authentication, Firebase Realtime Database, image uploading, user profiles, and a clean Material Design interface, providing a seamless and engaging travel community experience.",
    overview: "A social media mobile application designed for travelers to share experiences, discover destinations, and connect with a global community of explorers.",
    features: [
      "User Profile Management",
      "Travel Post Sharing",
      "Photo Upload & Gallery",
      "Destination Discovery",
      "Social Interaction (Like & Comment)",
      "Firebase Authentication",
      "Real-time Data Sync",
      "Material Design UI"
    ],
    tech: ["Android", "Jetpack Compose", "Firebase", "Kotlin", "Coil Image Library", "Material Design"],
    security: [
      "Firebase Authentication",
      "Firebase Security Rules",
      "Secure Image Uploads",
      "Protected User Data",
      "Real-time Database Security"
    ],
    performance: [
      "Native Android Performance",
      "Image Caching",
      "Offline Support",
      "Optimized UI Rendering",
      "Efficient Data Syncing"
    ],
    status: "Completed • Live • Maintained",
    github: "https://github.com/Zashiyh/Traveler1",
   
    number: "02"
  },
  {
    title: "IntelliChat AI",
    image: "/chatbot.png",
    description: "IntelliChat AI is an intelligent AI-powered chatbot web application developed using React, TypeScript, Tailwind CSS, FastAPI, Python, and MongoDB. The application enables users to interact with an AI assistant through a modern chat interface, supporting real-time conversations, file attachments, and secure message storage. It provides a fast, responsive, and user-friendly experience for AI-powered communication.",
    overview: "An AI-powered chatbot platform that delivers intelligent conversations through a modern, responsive web interface. The application leverages Gemini AI for natural language processing and provides a seamless user experience.",
    features: [
      "AI-Powered Conversations",
      "Real-time Chat Interface",
      "File Attachment Support",
      "Message History Storage",
      "User Authentication",
      "FastAPI Backend",
      "MongoDB Integration",
      "Responsive Design"
    ],
    tech: ["React", "TypeScript", "FastAPI", "Python", "MongoDB", "Tailwind CSS", "Gemini AI", "JWT"],
    security: [
      "JWT Authentication",
      "API Key Protection",
      "Input Validation",
      "Secure Message Storage",
      "Rate Limiting",
      "CORS Configuration"
    ],
    performance: [
      "FastAPI Async Performance",
      "Real-time Responses",
      "Optimized API Calls",
      "Efficient State Management",
      "Lazy Loading Components"
    ],
    status: "Completed • Live • Maintained",
    github: "https://github.com/Zashiyh/ChatBot",
    
    number: "03"
  },
  {
    title: "Smart POS System",
    image: "/smartpos.png",
    description: "SmartPOS Pro is a full-stack retail management system that enables businesses to manage products, inventory, sales, customers, invoices, and analytics through a modern, responsive dashboard. Built with Next.js, TypeScript, MongoDB, and JWT authentication, it delivers secure, fast, and scalable business operations.",
    overview: "A comprehensive retail management system that streamlines business operations with real-time inventory tracking, sales analytics, and customer management capabilities.",
    features: [
      "Product & Inventory Management",
      "Sales Processing",
      "Customer Management",
      "Invoice Generation",
      "Analytics Dashboard",
      "JWT Authentication",
      "Role-Based Access",
      "Real-time Data Updates"
    ],
    tech: ["React", "Next.js 15", "TypeScript", "MongoDB Atlas", "JWT Authentication", "Tailwind CSS"],
    security: [
      "JWT Authentication",
      "Role-Based Access Control",
      "Protected API Routes",
      "Input Validation",
      "Secure Data Storage",
      "Session Management"
    ],
    performance: [
      "Next.js 15 Performance",
      "Server-Side Rendering",
      "Optimized Database Queries",
      "Fast Dashboard Loading",
      "Reusable Components"
    ],
    status: "Completed • Live • Maintained",
    github: "https://github.com/Zashiyh/smart-pos",
    demo: "https://smart-pos-indol.vercel.app/",
    number: "04"
  },
  {
    title: "Gamer Zone",
    image: "/gamerzone.png",
    description: "GamerZone is a responsive game selling web application developed using HTML, CSS, PHP, and MySQL. The platform allows users to browse and purchase games through an intuitive interface, while administrators can manage game listings, categories, and customer orders. The system provides a secure and user-friendly online game store experience.",
    overview: "An online game store platform that connects gamers with their favorite titles. The system features game browsing, purchase management, and an administrative dashboard for content management.",
    features: [
      "Game Browsing & Search",
      "Purchase Management",
      "Game Categories",
      "Admin Dashboard",
      "Order Management",
      "User Authentication",
      "Secure Payment Integration",
      "Responsive Design"
    ],
    tech: ["HTML5", "CSS3", "PHP", "MySQL", "JavaScript", "Responsive Design"],
    security: [
      "PHP Session Security",
      "MySQL Injection Prevention",
      "Input Validation",
      "Secure Authentication",
      "Admin Access Control",
      "Data Encryption"
    ],
    performance: [
      "Optimized PHP Backend",
      "Efficient MySQL Queries",
      "Fast Page Load Times",
      "Reusable Code Structure",
      "Scalable Architecture"
    ],
    status: "Completed • Live • Maintained",
    github: "https://github.com/your-username/gamer-zone",
    
    number: "05"
  }
];

//  Optimized Modal Component 
const ProjectModal = ({ project, onClose }: { project: typeof projectsData[0] | null; onClose: () => void }) => {
  // Memoize modal content to prevent unnecessary re-renders
  const modalContent = useMemo(() => {
    if (!project) return null;

    return (
      <>
        {/* Banner Image */}
        <div className="modal-banner">
          <img 
            src={project.image} 
            alt={project.title} 
            loading="lazy"
            decoding="async"
          />
          <div className="modal-banner-overlay">
            <span className="modal-number">{project.number}</span>
            <h2 className="modal-title">{project.title}</h2>
          </div>
        </div>

        {/* Project Info */}
        <div className="modal-body">
          {/* Description */}
          <div className="modal-section">
            <h3>Overview</h3>
            <p>{project.overview}</p>
          </div>

          {/* Features */}
          <div className="modal-section">
            <h3>Key Features</h3>
            <ul className="modal-features">
              {project.features.map((feature, idx) => (
                <li key={idx}>
                  <FaCheck /> {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <div className="modal-section">
            <h3>Technologies Used</h3>
            <div className="modal-tech-tags">
              {project.tech.map((tech, idx) => (
                <span key={idx} className="modal-tech-tag">{tech}</span>
              ))}
            </div>
          </div>

          {/* Security Features */}
          <div className="modal-section modal-security">
            <h3><FaShieldAlt /> Security Features</h3>
            <div className="modal-security-grid">
              {project.security.map((item, idx) => (
                <span key={idx} className="modal-security-item">{item}</span>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="modal-section">
            <h3><FaRocket /> Performance</h3>
            <div className="modal-security-grid">
              {project.performance.map((item, idx) => (
                <span key={idx} className="modal-security-item performance-item">{item}</span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="modal-section">
            <h3>Project Status</h3>
            <div className="modal-status">
              {project.status.split(" • ").map((item, idx) => (
                <span key={idx} className="modal-status-badge">{item}</span>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="modal-buttons">
            <a 
              href={project.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="modal-btn modal-btn-github"
            >
              <FaGithub /> GitHub
            </a>
            <a 
              href={project.demo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="modal-btn modal-btn-demo"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          </div>
        </div>
      </>
    );
  }, [project]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // ESC key handler
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-container"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring", 
            damping: 30, 
            stiffness: 350,
            duration: 0.3
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <motion.button
            className="modal-close"
            onClick={onClose}
            whileHover={{ rotate: 90, scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <FaTimes />
          </motion.button>

          <div className="modal-content">
            {modalContent}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

//  Main Component 
export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<typeof projectsData[0] | null>(null);

  // Memoized open/close handlers
  const openModal = useCallback((project: typeof projectsData[0]) => {
    setSelectedProject(project);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  // Memoize animation variants to prevent recreation
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 }
  }), []);

  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }), []);

  return (
    <section id="projects" className="projects">
      <motion.div
        className="projects-container"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.4 }}
        >
          My <span>Projects</span>
        </motion.h2>

        <div className="project-grid">
          {projectsData.map((project, index) => {
            const isEven = index % 2 === 0;
            const cardVariants = {
              hidden: { opacity: 0, x: isEven ? -40 : 40 },
              visible: { opacity: 1, x: 0 }
            };

            return (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => openModal(project)}
                style={{ cursor: "pointer" }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <BorderGlow
                  edgeSensitivity={35}
                  glowColor="40 80 80"
                  backgroundColor="rgba(255,255,255,0.05)"
                  borderRadius={24}
                  glowRadius={50}
                  glowIntensity={1.2}
                  coneSpread={25}
                  animated={false}
                  colors={['#4cc9f0', '#2563eb', '#f72585']}
                  fillOpacity={0.3}
                  glassEffect={true}
                  glassBlur={20}
                  glassOpacity={0.10}
                >
                  <div className={`project-card ${!isEven ? 'project-card-reverse' : ''}`}>
                    {/* Image Section */}
                    <div className="project-image-wrapper">
                      <div className="project-image">
                        <img
                          src={project.image}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.currentTarget.src = `https://via.placeholder.com/600x400/0a0a1a/4cc9f0?text=${encodeURIComponent(project.title)}`;
                          }}
                        />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="project-content-wrapper">
                      <div className="project-content">
                        <div className="project-number">0{index + 1}</div>
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>

                        <div className="tech">
                          {project.tech.slice(0, 4).map((item, i) => (
                            <span key={i}>{item}</span>
                          ))}
                          {project.tech.length > 4 && (
                            <span className="tech-more">+{project.tech.length - 4}</span>
                          )}
                        </div>

                        <div className="project-links">
                          <a 
                            href={project.github} 
                            className="github-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaGithub /> Code
                          </a>
                          <a 
                            href={project.demo} 
                            className="demo-link"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaExternalLinkAlt /> Live Demo
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </BorderGlow>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={closeModal} />
        )}
      </AnimatePresence>
    </section>
  );
}