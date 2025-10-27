"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import {
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  Zap,
  Globe,
  Award,
  BarChart3,
  Shield,
  Rocket,
} from "lucide-react";

export function HomePageContent() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative py-24 md:py-40 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-accent/5 to-secondary/5" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2" />

          <div className="container-main relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Welcome to AnyWork
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold mb-8 text-balance bg-linear-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Your Career Starts Here
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-12 text-balance max-w-2xl mx-auto leading-relaxed">
                Connect with top employers, discover exceptional talent, and
                unlock unlimited career opportunities. AnyWork is the modern job
                marketplace built for the future of work.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="/jobs">
                    Explore Opportunities{" "}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="hover:bg-muted bg-transparent"
                >
                  <Link href="/register">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-y border-border">
          <div className="container-main">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <p className="text-muted-foreground">Active Jobs</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">100K+</div>
                <p className="text-muted-foreground">Job Seekers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary mb-2">
                  5K+
                </div>
                <p className="text-muted-foreground">Employers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container-main">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose AnyWork?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to find your dream job or hire top talent
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card-hover group">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Curated Opportunities
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access thousands of verified job listings from top companies
                  across industries. Every opportunity is carefully selected to
                  match your skills and aspirations.
                </p>
              </div>

              <div className="card-hover group">
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                  <Users className="w-7 h-7 text-accent" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">
                  Top Talent Network
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find skilled professionals ready to make an impact. Our
                  advanced matching algorithm connects you with the perfect
                  candidates for your team.
                </p>
              </div>

              <div className="card-hover group">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <TrendingUp className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Career Growth</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Track your progress with real-time analytics and insights.
                  Grow your career with personalized recommendations and
                  industry insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Tools Section */}
        <section className="py-24 bg-card">
          <div className="container-main">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Powerful Tools for Success
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Global Reach</h4>
                      <p className="text-muted-foreground">
                        Connect with opportunities worldwide and expand your
                        career horizons
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Verified Profiles</h4>
                      <p className="text-muted-foreground">
                        Trust and transparency in every interaction with
                        verified credentials
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <Zap className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">
                        Instant Notifications
                      </h4>
                      <p className="text-muted-foreground">
                        Never miss an opportunity or application with real-time
                        alerts
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="card bg-linear-to-br from-primary/10 to-primary/5 border-primary/20">
                  <BarChart3 className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Advanced Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Track job performance and candidate insights
                  </p>
                </div>
                <div className="card bg-linear-to-br from-accent/10 to-accent/5 border-accent/20">
                  <Shield className="w-8 h-8 text-accent mb-3" />
                  <h4 className="font-semibold mb-2">Secure Platform</h4>
                  <p className="text-sm text-muted-foreground">
                    Enterprise-grade security for your data
                  </p>
                </div>
                <div className="card bg-linear-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                  <Rocket className="w-8 h-8 text-secondary mb-3" />
                  <h4 className="font-semibold mb-2">Fast Hiring</h4>
                  <p className="text-sm text-muted-foreground">
                    Streamlined process to fill positions quickly
                  </p>
                </div>
                <div className="card bg-linear-to-br from-primary/10 to-accent/5 border-primary/20">
                  <Users className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-2">Team Collaboration</h4>
                  <p className="text-sm text-muted-foreground">
                    Work together seamlessly with your team
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary text-white">
          <div className="container-main text-center">
            <h2 className="text-5xl font-bold mb-6">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals and employers on AnyWork. Start
              your journey today.
            </p>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="bg-white hover:bg-white/90 text-primary"
            >
              <Link href="/register">Create Your Account</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
