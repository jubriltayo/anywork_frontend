"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "./login-form";
import { AuthService } from "@/lib/services/auth";

export function LoginPageContent() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    if (AuthService.isAuthenticated()) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background py-12">
        <div className="container-main max-w-md">
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
