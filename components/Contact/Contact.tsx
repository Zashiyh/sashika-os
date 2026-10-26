"use client";

import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp
} from "react-icons/fa";

import "./Contact.css";

export default function Contact() {
  // WhatsApp number - ඔයාගේ number එක දාන්න (country code එකත් එක්ක)
  const whatsappMessage = "Hi! I'm interested in your portfolio.";

  return (
    <section id="contact" className="contact">
      <motion.div
        className="contact-container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="contact-info">
          <h2>
            Let&apos;s <span>Connect</span>
          </h2>

          <p>
            Have a project idea or want to collaborate?
            Feel free to contact me.
          </p>

          <div className="info-item">
            <FaMapMarkerAlt />
            <span>Sri Lanka</span>
          </div>

          <div className="info-item">
            <FaEnvelope />
            <span>sashikamadushan2003@gmail.com</span>
          </div>

          <div className="social-links">
            <a
              href="https://github.com/Zashiyh"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>

            <a
              href="https://www.linkedin.com/in/sashika-madushan-448612299/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>

            <a
              href={`https://wa.me/${+94758178178}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="whatsapp-link"
            >
              <FaWhatsapp />
            </a>

            <a
              href="mailto:sashikamadushan2003@gmail.com"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>

        <form className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            required
          />

          <textarea
            placeholder="Your Message"
            rows={5}
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
          >
            Send Message 🚀
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}