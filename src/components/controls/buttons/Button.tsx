import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "grey";
  disabled?: boolean;
  onClick: () => void;
};

const baseStyles = "inline-block px-6 py-3 rounded-2xl transition font-medium shadow-lg";
const variants = {
  grey: "bg-[#344966] hover:bg-[#2a3b52] text-[#f0f4ef]",
  primary: "bg-[#e6aace] hover:bg-[#d495b8] text-[#0d1821]",
};

export const Button = ({ children, variant = "primary", disabled = false, onClick }: ButtonProps) => {
  return (
    <button className={`${baseStyles} ${disabled ? variants.grey : variants[variant]}`} disabled={disabled} onClick={onClick} type="button">
      {children}
    </button>
  );
};
