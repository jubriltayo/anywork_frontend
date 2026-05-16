"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export function HomePageContent() {
  return (
    <main className="bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-20 px-6">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(232,255,71,0.07) 0%, transparent 70%)" }}
        />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#e8ff47]/30 bg-[#e8ff47]/5 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e8ff47]" />
            <span className="text-[#e8ff47] text-xs font-semibold tracking-widest uppercase">
              Connecting talent with opportunity
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 max-w-4xl">
            The right job.<br />
            <span className="text-white/25">The right person.</span>
          </h1>

          <p className="text-white/50 text-xl md:text-2xl font-light max-w-xl mb-12 leading-relaxed">
            AnyWork makes it simple to find your next role or hire the person you have been looking for — without the noise.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/jobs"
              className="group flex items-center gap-2 px-8 py-4 bg-[#e8ff47] text-[#0a0a0f] font-bold text-base rounded-xl hover:bg-[#d4eb3a] transition-all"
            >
              Browse Open Roles
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-medium text-base rounded-xl hover:bg-white/5 transition-all"
            >
              Post a Job — Free
            </Link>
          </div>

          <div className="flex flex-wrap gap-3 mt-16">
            {[
              ["50K+", "Open Roles"],
              ["100K+", "Job Seekers"],
              ["5K+", "Companies Hiring"],
              ["95%", "Fill Rate"],
            ].map(([num, label]) => (
              <div key={label} className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03]">
                <span className="text-white font-bold text-xl">{num}</span>
                <span className="text-white/40 text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling categories */}
      <div className="border-y border-white/10 py-5 overflow-hidden bg-white/[0.02]">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(3)].flatMap((_, i) =>
            ["Engineering", "Product", "Design", "Marketing", "Data & Analytics", "Operations", "Finance", "Legal", "Sales", "Customer Success"]
              .map((cat) => (
                <span key={`${i}-${cat}`} className="text-white/30 text-sm font-medium tracking-widest uppercase">
                  {cat}
                </span>
              ))
          )}
        </div>
      </div>

      {/* For Employers */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="text-[#e8ff47] text-xs font-bold tracking-widest uppercase mb-4">For Employers</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight max-w-2xl">
              Hire without the<br />
              <span className="text-white/30">back and forth.</span>
            </h2>
            <p className="text-white/40 text-lg mt-6 max-w-xl leading-relaxed">
              Post a role, review applications, and move candidates through your pipeline — all in one place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
            {[
              {
                step: "01",
                title: "Post your role",
                body: "Describe the position, set your requirements, and go live in minutes. Your listing reaches thousands of active candidates right away.",
              },
              {
                step: "02",
                title: "Review applicants",
                body: "Applications arrive with resumes and cover letters attached. Accept, shortlist, or pass — all from one clean screen.",
              },
              {
                step: "03",
                title: "Make your hire",
                body: "Candidates are kept informed at every step. A smooth, professional process that reflects well on your company.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="bg-[#0a0a0f] p-10 hover:bg-[#111118] transition-colors">
                <span className="text-white/10 text-7xl font-black leading-none block mb-8">{step}</span>
                <h3 className="text-white text-xl font-bold mb-3">{title}</h3>
                <p className="text-white/40 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 px-7 py-4 bg-[#e8ff47] text-[#0a0a0f] font-bold text-sm rounded-xl hover:bg-[#d4eb3a] transition-all"
            >
              Start Hiring Today
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* For Job Seekers */}
      <section className="py-32 px-6 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-[#e8ff47] text-xs font-bold tracking-widest uppercase mb-4">For Job Seekers</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Your next role<br />
              <span className="text-white/30">is closer than you think.</span>
            </h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10">
              Search thousands of open roles, apply in seconds, and track every application from your personal dashboard. You will always know where you stand.
            </p>

            <div className="space-y-4">
              {[
                "Search by job type, location, and salary range",
                "Upload your resume once, use it everywhere",
                "Get notified the moment your application status changes",
                "Track all your applications in one place",
              ].map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-[#e8ff47]/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-[#e8ff47]" />
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            <Link
              href="/jobs"
              className="group inline-flex items-center gap-2 mt-10 px-7 py-4 border border-white/20 text-white font-medium text-sm rounded-xl hover:bg-white/5 transition-all"
            >
              Browse All Jobs
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* App preview mockup */}
          <div className="rounded-2xl border border-white/10 bg-[#111118] overflow-hidden">
            <div className="border-b border-white/10 px-5 py-4 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="ml-4 text-white/30 text-xs">My Applications</span>
            </div>
            <div className="p-5 space-y-3">
              {[
                { title: "Product Designer", company: "Acme Corp", status: "accepted", time: "2h ago" },
                { title: "UX Researcher", company: "Buildco", status: "reviewed", time: "1d ago" },
                { title: "Brand Strategist", company: "Nexus", status: "pending", time: "3d ago" },
                { title: "Motion Designer", company: "Stackd", status: "pending", time: "5d ago" },
              ].map(({ title, company, status, time }) => (
                <div key={title} className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3.5">
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-white/30 text-xs">{company} · {time}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    status === "accepted" ? "bg-[#e8ff47]/15 text-[#e8ff47]" :
                    status === "reviewed" ? "bg-blue-500/15 text-blue-400"   :
                                           "bg-white/10 text-white/40"
                  }`}>
                    {status === "accepted" ? "Accepted" : status === "reviewed" ? "In Review" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why AnyWork */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[#e8ff47] text-xs font-bold tracking-widest uppercase mb-4">Why AnyWork</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              Built for both sides<br />
              <span className="text-white/30">of the table.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "🎯",
                title: "Made for your role",
                desc: "Employers and candidates each get their own tailored dashboard. No clutter, no confusion.",
              },
              {
                icon: "📬",
                title: "Always in the loop",
                desc: "Both sides get notified the moment anything changes. No more chasing updates.",
              },
              {
                icon: "📁",
                title: "Easy resume management",
                desc: "Upload your CV once and apply to any role. We make sure your application always arrives cleanly.",
              },
              {
                icon: "📊",
                title: "See what is working",
                desc: "Employers can track how their listings are performing and which roles are getting the most attention.",
              },
            ].map(({ icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 hover:border-white/20 hover:bg-white/[0.05] transition-all"
              >
                <span className="text-3xl block mb-5">{icon}</span>
                <h3 className="text-white font-bold text-lg mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed mb-8">
            &ldquo;We filled three roles in two weeks. The process was clean, candidates were kept informed, and the whole experience felt professional on both ends.&rdquo;
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8ff47]/20 flex items-center justify-center">
              <span className="text-[#e8ff47] font-bold text-sm">SA</span>
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-semibold">Sarah A.</p>
              <p className="text-white/30 text-xs">Head of People, Acme Corp</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40 px-6 relative overflow-hidden border-t border-white/10">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(232,255,71,0.05) 0%, transparent 70%)" }}
        />
        <div className="relative max-w-2xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Ready to get started?
          </h2>
          <p className="text-white/40 text-xl mb-10">
            Whether you are hiring or looking — AnyWork has you covered.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-[#e8ff47] text-[#0a0a0f] font-black text-lg rounded-xl hover:bg-[#d4eb3a] transition-all"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-3 px-10 py-5 border border-white/20 text-white font-medium text-lg rounded-xl hover:bg-white/5 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}