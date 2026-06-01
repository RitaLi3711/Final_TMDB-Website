import { FaGithub, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="mt-auto border-[#344966] border-t bg-[#0d1821] py-6">
      <div className="mx-auto flex max-w-400 flex-col items-center justify-between gap-4 px-5 sm:flex-row">
        <p className="text-gray-400 text-sm">Built with React, Vite, Tailwind and React Router</p>

        <div className="flex gap-4">
          <a
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
            href="https://github.com/RitaLi3711"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaGithub size={20} />
            <span className="text-sm">GitHub</span>
          </a>
          <a
            className="flex items-center gap-2 text-gray-400 transition-colors hover:text-white"
            href="https://linkedin.com/in/rita-li-051044374"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaLinkedin size={20} />
            <span className="text-sm">LinkedIn</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
