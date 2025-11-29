"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import GradientButton from "@/components/GradientButton";

export default function SignupPage() {
  // Placeholder for Firebase signup logic
  const handleSignup = async (formData: FormData) => {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");
    console.log("Signing up with:", email, password);
    // TODO: Implement Firebase registration
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/50 p-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/80 p-3 rounded-xl inline-block mb-4">
            <Briefcase className="text-primary-foreground h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-bold">Create an Account</CardTitle>
          <CardDescription>Join JobTrend Pro to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSignup} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <GradientButton type="submit" className="w-full text-lg h-12">
              Sign Up
            </GradientButton>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
