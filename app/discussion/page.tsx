"use client";

import Navbar from "../components/ui/Navbar";
import ChatInterface from "../components/ChatInterface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  firstTime: boolean;
  username: string;
  seedName: string;
}

interface SeedDetails {
  ind: number;
  seed_description: string;
  max_temp: number;
  min_temp: number;
  max_brightness_level: number;
  min_brightness_level: number;
  max_humidity: number;
  min_humidity: number;
}

export default function Discussion() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [usr, setUsr] = useState<User | null>(null);
  const [seedDetails, setSeedDetails] = useState<SeedDetails | null>(null);

  useEffect(() => {
    const fetchUserAndSeed = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch("http://localhost:3001/auth/user", {
          credentials: "include",
        });

        if (!userResponse.ok) {
          alert("User not logged in");
          throw new Error("Not authenticated");
        }

        const userData = await userResponse.json();
        setMessage(`Hi ${userData.username}`);
        setUsr(userData);

        // If the user has a seedName, fetch the seed details
        if (userData.seedName) {
          const seedResponse = await fetch(
            "http://localhost:3001/seedDiscussion/seedDetails",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({ seedName: userData.seedName }),
            }
          );

          if (!seedResponse.ok) {
            throw new Error("Failed to fetch seed details");
          }

          const seedData = await seedResponse.json();
          console.log("Seed details:", seedData);
          setSeedDetails(seedData.data); // Assuming seedData.data contains the seed details
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("Not logged in");
        router.push("/");
      }
    };

    fetchUserAndSeed();
  }, [router]);

  // Debugging: Log seedDetails when it updates
  useEffect(() => {
    if (seedDetails) {
      console.log("Updated seed details:", seedDetails.seed_description);
    }
  }, [seedDetails]);

  return (
    <>
      <Navbar name={message} discussion={true} />
      <div className="container mx-auto p-4">
        <ChatInterface/>
      </div>
    </>
  );
}
