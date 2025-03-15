"use client";

import { FaPersonRunning, FaLaptopCode, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <div className="text-center text-sm text-gray-500 mt-8 mb-4 flex items-center justify-center gap-2 print:hidden">
      <div className="flex items-center gap-1">
        micro app vibe coded{" "}
        <FaPersonRunning className="inline text-blue-400 text-lg dance-icon" />{" "}
        <FaLaptopCode className="inline text-blue-500 text-lg" /> by{" "}
        <a
          href="https://www.silv.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          silv.app
        </a>
      </div>
      <span className="mx-2">|</span>
      <a
        href="https://github.com/mattsilv/markdown"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex items-center gap-1"
      >
        <FaGithub className="inline text-lg" /> GitHub
      </a>
    </div>
  );
}
