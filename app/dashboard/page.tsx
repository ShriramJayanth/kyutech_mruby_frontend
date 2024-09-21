"use client";

import Navbar from "../components/ui/Navbar";
import apple from "/home/shriramjayanth/Desktop/kyutech_mruby_frontend/assets/apple.jpeg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Seed from "../components/Seed";
import tomato from "../../assets/tomato.png";
import watermelon from "../../assets/watermelon.jpeg";
import carrot from "../../assets/carrot.jpeg";
import chilli from "../../assets/chilli.png";
import grapes from "../../assets/grapes.png";
import lemon from "../../assets/lemon.jpeg";
import mushroom from "../../assets/mushroom.png";

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

interface RealTimeData {
  temperature: number;
  lightIntensity: number;
  humidity: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [message, setMessage] = useState<string>("");
  const [usr, setUsr] = useState<User | null>(null);
  const [seedDetails, setSeedDetails] = useState<SeedDetails | null>(null);
  const [realTimeData, setRealTimeData] = useState<RealTimeData | null>(null);
  const [temperatureColor, setTemperatureColor] = useState<string>("bg-green-400");
  const [lightColor, setLightColor] = useState<string>("bg-green-400");
  const [humidityColor, setHumidityColor] = useState<string>("bg-green-400");
  const [temp,settemp]=useState(0)
  const [intensity,setintensity]=useState(0)


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
          const seedResponse = await fetch("http://localhost:3001/seedDiscussion/seedDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ seedName: userData.seedName }), // Send seedName in the request body
          });

          if (!seedResponse.ok) {
            throw new Error("Failed to fetch seed details");
          }

          const seedData = await seedResponse.json();
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
  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await fetch("http://192.168.1.69:5000/temp");
        const data = await response.json();
        
        // Debugging logs
        console.log("Fetched real-time data:", data);
        
        settemp(data.temp);
        setintensity(data.intensity);
        setRealTimeData(data);
        
        // Alert for temperature
        if (data.temp > (seedDetails?.max_temp || 0)) {
          console.log("Temperature beyond max limit.");
          alert("Temperature gone beyond the maximum temperature. Take care immediately.");
          setTemperatureColor("bg-red-500");
        } else if (data.temp < (seedDetails?.min_temp || 0)) {
          console.log("Temperature below min limit.");
          alert("Temperature gone below the minimum temperature. Take care immediately.");
          setTemperatureColor("bg-blue-500");
        } else {
          setTemperatureColor("bg-green-400");
        }
  
        // Alert for light intensity
        if (data.intensity > (seedDetails?.max_brightness_level || 0)) {
          console.log("Light intensity beyond max limit.");
          alert("Light intensity gone beyond the maximum limit. Take care immediately.");
          setLightColor("bg-red-500");
        } else if (data.intensity < (seedDetails?.min_brightness_level || 0)) {
          console.log("Light intensity below min limit.");
          alert("Light intensity gone below the minimum limit. Take care immediately.");
          setLightColor("bg-blue-500");
        } else {
          setLightColor("bg-green-400");
        }
  
        // Update colors based on humidity
        if (data.humidity > (seedDetails?.max_humidity || 0)) {
          setHumidityColor("bg-red-500");
        } else if (data.humidity < (seedDetails?.min_humidity || 0)) {
          setHumidityColor("bg-blue-500");
        } else {
          setHumidityColor("bg-green-400");
        }
  
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      }
    };
  
    const interval = setInterval(fetchRealTimeData, 5000); // Fetch data every 5 seconds
  
    return () => clearInterval(interval); // Clear interval on component unmount
  }, [seedDetails]);

  return (
    <div className="h-[110vh]">
      <Navbar name={message} dashboard={true} />
      <div className="h-[5vh]"></div>
      <div className="h-[45vh] flex items-center justify-center">
        <div className="h-[100%] w-[80%] flex">
          <div className="h-[100%] w-[25%]">
            <div className="h-[80%] w-[100%] relative">
              <Image
                src={Seeds[seedDetails?.ind || 0].imgName}
                alt={usr?.seedName || "none"}
                layout="fill"
                objectFit="contain"
                className="rounded-t-3xl"
              />
            </div>
          </div>
          <div className="h-[100%] w-[75%] bg-blue-600 rounded-full text-white flex items-center justify-center font-semibold">
            <div className="w-[70%]">
              {seedDetails ? (
                <>
                  <p className="text-4xl">{usr?.seedName}</p>
                  <div className="h-[10px]"></div>
                  <p>{seedDetails.seed_description}</p>
                  <div className="h-[10px]"></div>
                  <p><strong>Max Temperature:</strong> {seedDetails.max_temp}°C</p>
                  <p><strong>Min Temperature:</strong> {seedDetails.min_temp}°C</p>
                  <p><strong>Max Brightness Level:</strong> {seedDetails.max_brightness_level}</p>
                  <p><strong>Min Brightness Level:</strong> {seedDetails.min_brightness_level}</p>
                  <p><strong>Max Humidity:</strong> {seedDetails.max_humidity}%</p>
                  <p><strong>Min Humidity:</strong> {seedDetails.min_humidity}%</p>
                </>
              ) : (
                <p>Loading seed details...</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="h-[2.5vh]"></div>
      <div className="h-[50vh] flex items-center justify-around text-gray-600">
        <div className={`h-[100%] w-[25%] rounded-3xl ${lightColor} flex flex-col items-center justify-center`}>
          <div className="h-[50%] w-[100%] flex items-center justify-center text-9xl">
            {intensity}
          </div>
          <div className="h-[10%] w-[100%] flex items-center justify-center">
            LIGHT INTENSITY
          </div>
        </div>
        <div className={`h-[100%] w-[25%] rounded-3xl ${temperatureColor} flex flex-col items-center justify-center`}>
          <div className="h-[50%] w-[100%] flex items-center justify-center text-9xl">
            {temp}
          </div>
          <div className="h-[10%] w-[100%] flex items-center justify-center">
            TEMPERATURE
          </div>
        </div>
        <div className={`h-[100%] w-[25%] rounded-3xl ${humidityColor} flex flex-col items-center justify-center`}>
          <div className="h-[50%] w-[100%] flex items-center justify-center text-9xl">
            {"30%"}
          </div>
          <div className="h-[10%] w-[100%] flex items-center justify-center">
            HUMIDITY
          </div>
        </div>
      </div>
      <div className="h-[2.5vh]"></div>
    </div>
  );
}