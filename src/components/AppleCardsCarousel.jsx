"use client";
import React from "react";
import { Carousel, Card } from "./ui/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card, index) => (
    <Card key={card.src} card={card} index={index} />
  ));

  return (
    (<div className="w-full h-full py-10">
      <h2
        className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans"style={{ background: 'linear-gradient(135deg, rgb(209 141 95), #B48CDE)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',}}>
        Explore, What Secondmemory.ai can do ?
      </h2>
      <Carousel items={cards} />
    </div>)
  );
}



const data = [
  {
    category: "Workstream Memory",
    title: "Build your Custom Knowledge.",
    src: "./images/gradhome.jpg",
   
  },
  {
    category: "Intelligent RAG",
    title: "Enhance your productivity by querying your Memory.",
    src: "./images/gradhome2.jpg",

  },
  {
    category: "Artificial Intelligence",
    title: "Query your codebase, Debug, Improve, Enhance.",
    src: "./images/gradhome3.jpg",
  },
  {
    category: "Auto Code Gen",
    title: "Provide your code Context and generate code with Agentic AI.",
    src: "./images/gradhome4.jpg",
  },


];
