"use client";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoginProps {
  toggleLogin: () => void;
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export default function Login({ toggleLogin }: LoginProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        credentials: "include",
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const errorData = await res.json();
        // console.error("Error:", errorData);
        alert("Invalid password");
        return;
      }
      const data = await res.json();
      alert("login successfull");
      if (data.firstTime==true) {
        router.push("/home");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-6 bg-blue-600 text-white">
      <div className="flex items-center justify-center text-[80px]">
        Ikiki
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="max-w-md w-full flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input
                      className="text-black"
                      placeholder="Email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Password"
                      className="text-black"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
          <div className="flex justify-center">
            Yet to sign up?{" "}
            <button
              type="button"
              onClick={toggleLogin}
              className="hover:text-gray-300 font-semibold ml-2"
            >
              Register
            </button>
          </div>
        </form>
      </Form>
    </main>
  );
}
