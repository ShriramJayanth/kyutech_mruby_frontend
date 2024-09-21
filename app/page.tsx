"use client";
import Register from "@/components/ui/Register";
import Login from "@/components/Login";
import { useState } from "react";

export default function Home() {
  const [isLogin,setIsLogin] = useState(true);

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  return <div>{isLogin ? <Login toggleLogin={toggleLogin}/> : <Register toggleLogin={toggleLogin} />}</div>;
}