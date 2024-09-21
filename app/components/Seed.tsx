import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Seed(props: any) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize the Next.js router

  const handleClick = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/seedDiscussion/selectSeed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies (JWT) for authentication
        body: JSON.stringify({
          seedName: props.name, // Send the seed name as part of the request body
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to select seed");
      }

      const data = await response.json();
      console.log("Seed selected:", data);
      alert(`You have selected: ${props.name}`);

      // Redirect to the dashboard after successful seed selection
      router.push("/dashboard");
    } catch (err) {
      console.error("Error selecting seed:", err);
      alert("Error selecting seed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-[35%] w-[20%] rounded-3xl cursor-pointer"
      onClick={handleClick}
    >
      <div className="h-[80%] w-[100%] relative">
        <Image
          src={props.ImgPath}
          alt={props.name}
          layout="fill"
          objectFit="contain"
          className="rounded-t-3xl"
        />
      </div>
      <div className="h-[20%] w-[100%] flex justify-center items-center">
        <p className="text-black text-lg">{isLoading ? "Loading..." : props.name}</p>
      </div>
    </div>
  );
}
