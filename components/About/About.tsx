"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import "./About.css";

const timeline = [
  {
    year: "2023 - Present",
    title: "Software Engineering Undergraduate",
    place: "NIBM",
    description:
      "Studying Software Engineering with focus on modern web development, databases and software architecture."
  },
  {
    year: "Learning",
    title: "Full Stack Development",
    place: "React | Next.js | Node.js",
    description:
      "Building scalable web applications with modern frontend and backend technologies."
  },
  {
    year: "Exploring",
    title: "Cloud & Cyber Security",
    place: "AWS | Networking | Security",
    description:
      "Developing knowledge in cloud infrastructure, networking and cybersecurity concepts."
  }
];

const stats = [
  {
    number: 10,
    label: "Projects Built",
    suffix: "+"
  },
  {
    number: 15,
    label: "Technologies",
    suffix: "+"
  },
  {
    number: 2,
    label: "Years Learning",
    suffix: "+"
  }
];

// CountUp Component
function CountUp({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLHeadingElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime: number;

          const animateCount = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const currentCount = Math.floor(easedProgress * end);
            setCount(currentCount);

            if (progress < 1) {
              requestAnimationFrame(animateCount);
            } else {
              setCount(end);
            }
          };

          requestAnimationFrame(animateCount);
        }
      },
      { threshold: 0.3 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <h3 ref={countRef}>
      {count}
      {suffix}
    </h3>
  );
}

export default function About() {
  return (
    <section id="about" className="about">
      <motion.div
        className="about-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="about-left">
          <h2>
            About <span>Me</span>
          </h2>

          <p>
            I&apos;m Sashika Madushan, a Software Engineering undergraduate
            passionate about building modern web applications,
            backend systems and exploring cloud technologies.
          </p>

          <p>
            I enjoy creating interactive user experiences,
            learning new technologies and developing solutions
            that solve real-world problems.
          </p>

          <div className="stats">
            {stats.map((item, index) => (
              <div className="stat-card" key={index}>
                <CountUp end={item.number} suffix={item.suffix} />
                <p>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="timeline">
          {timeline.map((item, index) => (
            <motion.div
              className="timeline-item"
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="dot"></div>
              <div className="timeline-card">
                <span>{item.year}</span>
                <h3>{item.title}</h3>
                <h4>{item.place}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}