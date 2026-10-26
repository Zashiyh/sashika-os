"use client";
import { SiFastapi } from "react-icons/si";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaGitAlt,
  FaDatabase,
  FaLinux,
  FaCode,
  FaServer,
  FaCloud,
  FaPaintBrush,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiFirebase,
  SiFigma,
  SiPostman,
} from "react-icons/si";

import "./Skills.css";

const skills = [
  {
    category: "Frontend",
    icon: <FaCode />,
    items: [
      { name: "React", icon: <FaReact />, level: 90 },
      { name: "Next.js", icon: <SiNextdotjs />, level: 85 },
      { name: "TypeScript", icon: <SiTypescript />, level: 80 },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, level: 90 },
    ]
  },
  {
    category: "Backend",
    icon: <FaServer />,
    items: [
      { name: "Node.js", icon: <FaNodeJs />, level: 85 },
      { name: "MongoDB", icon: <SiMongodb />, level: 80 },
      { name: "Firebase", icon: <SiFirebase />, level: 75 },
      { name: "SQL / Oracle", icon: <FaDatabase />, level: 80 }
    ]
  },
  {
    category: "Cloud & Tools",
    icon: <FaCloud />,
    items: [
      { name: "AWS", icon: <FaAws />, level: 75 },
      { name: "Git", icon: <FaGitAlt />, level: 85 },
      { name: "Linux", icon: <FaLinux />, level: 75 },
    ]
  },
  {
    category: "Design & Development Tools",
    icon: <FaPaintBrush />,
    items: [
      { name: "Figma", icon: <SiFigma />, level: 85 },
      { name: "FastAPI", icon: <SiFastapi />, level: 75 },
      { name: "Postman", icon: <SiPostman />, level: 85 }
    ]
  }
];

// Animated Skill Item
function AnimatedSkillItem({ skill, delay = 0 }: { skill: { name: string; icon: React.ReactNode; level: number }; delay?: number }) {
  const [width, setWidth] = useState(0);
  const [count, setCount] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setTimeout(() => {
            setWidth(skill.level);
            
            let startTime: number;
            const duration = 1200;

            const animateCount = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const progress = Math.min((timestamp - startTime) / duration, 1);
              const easedProgress = 1 - Math.pow(1 - progress, 3);
              const currentCount = Math.floor(easedProgress * skill.level);
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              } else {
                setCount(skill.level);
              }
            };

            requestAnimationFrame(animateCount);
          }, delay);
        }
      },
      { threshold: 0.2 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, [skill.level, delay, hasAnimated]);

  return (
    <motion.div
      className="skill-item"
      ref={itemRef}
      whileHover={{ scale: 1.03 }}
    >
      <div className="skill-header">
        <div className="skill-icon">{skill.icon}</div>
        <div className="skill-info">
          <h4 className="skill-name">{skill.name}</h4>
          <span className="skill-level">{count}%</span>
        </div>
      </div>
      <div className="skill-bar-track">
        <div
          className="skill-bar-fill"
          style={{
            width: `${width}%`,
            transition: `width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="skills">
      <motion.div
        className="skills-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2>
          My <span>Skills</span>
        </h2>

        <div className="skills-layout">
          {skills.map((group, index) => (
            <div className="skill-category" key={index}>
              <div className="category-header">
                <div className="category-icon">{group.icon}</div>
                <h3 className="category-title">{group.category}</h3>
              </div>
              <div className="skills-list">
                {group.items.map((skill, i) => (
                  <AnimatedSkillItem
                    key={i}
                    skill={skill}
                    delay={i * 120 + index * 80}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}