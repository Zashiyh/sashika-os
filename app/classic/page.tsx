"use client";

import { useEffect, useState } from "react";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Hero from "@/components/Hero/Hero";
import Loading from "@/components/Loding/Loading";
import Projects from "@/components/Projects/Projects";
import Skills from "@/components/Skills/Skills";

export default function ClassicHome() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Original loading screen duration
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return isLoading ? (
    <Loading />
  ) : (
    <main>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  );
}
