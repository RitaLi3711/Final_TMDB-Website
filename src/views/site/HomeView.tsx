import { useNavigate } from "react-router-dom";
import { Button } from "@/components";

export const HomeView = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0d1821] text-[#f0f4ef]">
      <section className="w-full max-w-3xl space-y-8 text-center">
        <h1 className="font-bold text-5xl text-[#e6aace] tracking-tight">TMDB Explorer</h1>
        <p className="text-[#bfcc94] text-lg">Explore movies and discover people using a fast, modern interface.</p>
        <Button onClick={() => navigate("/movies")}>Enter</Button>
      </section>
    </main>
  );
};
