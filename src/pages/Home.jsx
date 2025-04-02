import Hero from "../components/Hero";
import { Navbar } from "../components/Navbar";
import Prize from "../components/Prize.jsx";
import { AppleCardsCarouselDemo } from "../components/AppleCardsCarousel";

import Features from "../components/Features";
import TechUI from "../components/TechUI";
import { SignInButton } from "@clerk/clerk-react";
import UltimateAI from "../components/UltimateAI.jsx";


function Home() {
  console.log('Home component rendering');
  return (
    <div className="bg-black w-full">
      <Navbar />
      <Hero />
      <Features />
      <Prize />
      <UltimateAI/>
      <AppleCardsCarouselDemo />
      <TechUI />
      <br />

      <br />
    </div>
  );
}

export default Home;
