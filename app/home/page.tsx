"use client";

import Image from "next/image";
import  Seed  from ".././components/Seed";
import tomato from "../../assets/tomato.png";
import apple from "../../assets/apple.jpeg";
import watermelon from "../../assets/watermelon.jpeg";
import carrot from "../../assets/carrot.jpeg";
import chilli from "../../assets/chilli.png";
import grapes from "../../assets/grapes.png";
import lemon from "../../assets/lemon.jpeg";
import mushroom from "../../assets/mushroom.png";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";

const Seeds = [
  { name: "Tomato", imgName: tomato },
  { name: "Apple", imgName: apple },
  { name: "Watermelon", imgName: watermelon },
  { name: "Carrot", imgName: carrot },
  { name: "Chilli", imgName: chilli },
  { name: "Grapes", imgName: grapes },
  { name: "Lemon", imgName: lemon },
  { name: "Mushroom", imgName: mushroom }
];

export default function Home() {
  const router = useRouter();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/user", {
          credentials: "include",
        });

        if (!response.ok) {
          alert("User not logged in");
          throw new Error("Not authenticated");
        }

        const content = await response.json();
        setMessage(`Hi ${content.username}`);
      } catch (error) {
        setMessage("Not logged in");
        router.push("/");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="h-screen flex flex-col justify-center items-center p-4">
      <div className="h-[20%] w-full flex text-blue-800 justify-center items-center text-5xl font-bold">
        CHOOSE YOUR SEED
      </div>
      <div className="h-[80%] w-full flex flex-col justify-center items-center">
        <div className="h-full w-full flex flex-wrap justify-center gap-6 p-4">
          {Seeds.map((seed, index) => (
            <Seed key={index} name={seed.name} ImgPath={seed.imgName} />
          ))}
        </div>
      </div>
      <div>{message}</div>
    </div>
  );
}
