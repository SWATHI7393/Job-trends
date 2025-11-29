import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, Briefcase, Lightbulb, PenTool, Search, TrendingUp } from "lucide-react";
import Link from "next/link";

const quickLinks = [
  {
    title: "Predict Job Trends",
    description: "Forecast demand for specific roles.",
    icon: TrendingUp,
    href: "/predict-trend",
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-900/50",
  },
  {
    title: "Analyze Skill Gaps",
    description: "Identify skills you need to succeed.",
    icon: Lightbulb,
    href: "/skill-gap",
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-900/50",
  },
  {
    title: "Scan Your Resume",
    description: "Optimize your resume for ATS.",
    icon: PenTool,
    href: "/resume-analyzer",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/50",
  },
];

const trendingJobs = [
  { title: "AI/ML Engineer", trend: "+18%" },
  { title: "Data Scientist", trend: "+15%" },
  { title: "Cybersecurity Analyst", trend: "+12%" },
  { title: "Cloud Solutions Architect", trend: "+10%" },
  { title: "DevOps Engineer", trend: "+9%" },
  { title: "Frontend Developer", trend: "+7%" },
];

export default function Home() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 md:gap-12">
        {/* Header and Hero */}
        <header className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input placeholder="Search for jobs, skills, or industries..." className="pl-12 h-12 text-lg rounded-xl" />
          </div>
          <div className="text-center py-12 md:py-20 rounded-2xl bg-secondary/50">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600">
              Predict Future Job Trends with AI
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay ahead of the curve. Leverage our AI-powered insights to navigate your career path with confidence.
            </p>
          </div>
        </header>

        {/* Quick Links */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.title} className="group">
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className={`p-2 rounded-lg ${link.bgColor}`}>
                      <link.icon className={`${link.color}`} />
                    </div>
                    <ArrowRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-xl font-bold">{link.title}</h3>
                    <p className="text-muted-foreground mt-1">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Jobs */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Market Pulse</h2>
          <Card>
            <CardHeader>
              <CardTitle>Trending Job Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingJobs.map((job) => (
                  <div key={job.title} className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-3">
                      <Briefcase className="text-primary" />
                      <span className="font-medium">{job.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingUp size={16} />
                      <span className="font-semibold">{job.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
}
