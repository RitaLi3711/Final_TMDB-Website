import type { ReactNode } from "react";

type DetailItemProps = {
  label: string;
  value: string | number;
  large?: boolean;
  icon?: ReactNode;
};

export const DetailItem = ({ label, value, large = false, icon }: DetailItemProps) => {
  return (
    <div className="rounded-2xl bg-[#2a3b52] p-4">
      <p className="text-[#bfcc94] text-xs uppercase tracking-wider">{label}</p>
      <div className="mt-1 flex items-center gap-2">
        {icon && <span className="text-gray-400">{icon}</span>}
        <p className={`mt-1 font-medium text-white ${large ? "text-xl" : "text-lg"}`}>{value}</p>
      </div>
    </div>
  );
};
