import { Link } from "@/components";

type LinkGroupProps = {
  options: Array<{
    label: string;
    to: string;
    match?: string[];
  }>;
};

export const LinkGroup = ({ options }: LinkGroupProps) => {
  return (
    <div className="flex gap-6">
      {options.map((option) => (
        <Link key={option.label} match={option.match} replace={true} to={option.to}>
          {option.label}
        </Link>
      ))}
    </div>
  );
};
