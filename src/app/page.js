"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

// Icons
const UploadIcon = () => (
  <svg className="w-12 h-12 text-[#0078D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const MagicIcon = () => (
  <svg className="w-12 h-12 text-[#0078D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-12 h-12 text-[#0078D4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans">
      {/* Hero Section */}
      <section className="h-[80vh] flex items-center justify-center bg-gradient-to-b from-white to-blue-50 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-[#333] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simplify Your Papers, Understand Them Better
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Upload a PDF, refine it with AI, and edit with ease—all in one place.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link 
              href="/viewer" 
              className="inline-block bg-[#0078D4] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0062ab] transform hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#333] mb-16">How Simplim Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <UploadIcon />, title: "Upload Your PDF", desc: "Drag or click to start" },
              { icon: <MagicIcon />, title: "Simplify with AI", desc: "Clear, concise text instantly" },
              { icon: <EditIcon />, title: "Edit & Understand", desc: "Refine and grasp key points" }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-all text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex justify-center mb-4">{step.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-[#333] mb-16">Why Choose Simplim?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "AI-Powered Simplification", desc: "Turn complex text into plain language" },
              { title: "Rich Text Editing", desc: "Format and tweak with ease" },
              { title: "Better Comprehension", desc: "Summaries and key points at your fingertips" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-[#E6F0FA]">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-8">Ready to simplify your papers?</h3>
          <Link 
            href="/simplim" 
            className="inline-block bg-[#0078D4] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#0062ab] transform hover:scale-105 transition-all"
          >
            Try Simplim Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333] text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm">© Simplim 2025</div>
          <div className="flex gap-8 text-sm">
            {/* <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
