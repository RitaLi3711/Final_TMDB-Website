import { useNavigate } from "react-router-dom";
import { Button } from "@/components";

export const ErrorView = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-[#0d1821] text-[#f0f4ef]">
      <h1 className="font-bold text-4xl text-[#e6aace]">404</h1>
      <p className="text-[#bfcc94]">Page not found</p>
      <Button onClick={() => navigate(-1)}>Back</Button>
    </main>
  );
};
