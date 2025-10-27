"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { RegisterForm } from "./register-form";
import { AuthService } from "@/lib/services/auth";

export function RegisterPageContent() {
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
        <div className="container-main max-w-2xl">
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
