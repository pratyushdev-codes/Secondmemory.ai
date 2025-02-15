import Hero from "../components/Hero";
import { Navbar } from "../components/Navbar";
import Prize from "../components/Prize.jsx";
import { AppleCardsCarouselDemo } from "../components/AppleCardsCarousel";
import { GradualSpacingDemo } from "../components/GradualSpacingDemo";
import Features from "../components/Features";
import TechUI from "../components/TechUI";
import { SignInButton } from "@clerk/clerk-react";


function Home() {
  return (
    <div className="bg-black w-full">
      <Navbar />
      <Hero />
      <Features />
      <Prize />
      <AppleCardsCarouselDemo />
      <TechUI />
      <br />
      <GradualSpacingDemo />
      <br />
    </div>
  );
}

export default Home;
