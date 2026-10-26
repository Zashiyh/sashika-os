"use client";

import { TypeAnimation } from "react-type-animation";
import Lightfall from "./Lightfall/Lightfall";
import { motion } from "framer-motion";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
} from "react-icons/fa";

import "./Hero.css";

export default function Hero() {
  const handleContactClick = () => {
    window.location.href = "mailto:sashikamadushan2003@gmail.com";
  };

  return (
    <section id="home" className="hero">
      {/* LIGHTFALL BACKGROUND */}
      <div className="lightfall-bg">
        <Lightfall
          colors={["#2cc7f6", "#d2d0dc", "#2f04dc"]}
          backgroundColor="#030712"
          speed={1}
          streakCount={1}
          streakWidth={1}
          streakLength={1.5}
          glow={2}
          density={1}
          twinkle={1}
          zoom={2}
          backgroundGlow={0.8}
          opacity={0.9}
          mouseInteraction={true}
          mouseStrength={0.4}
          mouseRadius={0.4}
        />
      </div>

      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="hello">Hi I&apos;M</p>

        <h1 className="glitch">
          <span className="first-name">Sashika</span>
          <span className="last-name">Madushan</span>
        </h1>

        <TypeAnimation
          sequence={[
            "Software Engineer",
            2000,
            "Full Stack Developer",
            2000,
            "Cloud Computing Enthusiast",
            2000,
            "Cyber Security Learner",
            2000,
          ]}
          wrapper="h2"
          speed={50}
          repeat={Infinity}
        />

        <p className="description">
          Full Stack Developer | Cloud Computing Enthusiast | Cyber Security
          Learner
        </p>

        <div className="buttons">
          <motion.button
            className="primary-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            View Projects
          </motion.button>

          <motion.button
            className="secondary-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            Download CV
          </motion.button>
        </div>

        <div className="socials">
          <a href="https://github.com/Zashiyh" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/sashika-madushan-448612299/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin />
          </a>
          <a href="mailto:sashikamadushan2003@gmail.com" aria-label="Email">
            <FaEnvelope />
          </a>
        </div>
      </motion.div>

      {/* PROFILE CARD - React Bits */}
      <div className="profile-wrapper">
        <ProfileCard
          name="Sashika Madushan"
          title="Software Engineer"
          handle="sashikamadushan"
          status="Available for work"
          contactText="Let's Connect"
          avatarUrl="/profile.png"
          miniAvatarUrl="/profile.png"
          showUserInfo={true}
          enableTilt={true}
          enableMobileTilt={false}
          behindGlowEnabled={true}
          behindGlowColor="rgba(0, 229, 255, 0.67)"
          behindGlowSize="50%"
          innerGradient="linear-gradient(145deg, rgba(0,229,255,0.08) 0%, rgba(10,10,30,0.95) 100%)"
          onContactClick={handleContactClick}
          iconUrl="/iconp.png"
          className="hero-profile-card"
        />
      </div>

      <div className="scroll">Scroll ↓</div>
    </section>
  );
}