import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowUpRight, BarChart, Briefcase, Cpu, Map, TrendingUp } from "lucide-react";
import Image from 'next/image';

const trendingRoles = [
  { name: "AI Ethicist", growth: "35%", category: "Emerging Tech" },
  { name: "Quantum ML Analyst", growth: "32%", category: "Deep Tech" },
  { name: "Chief Metaverse Officer", growth: "28%", category: "Web3" },
  { name: "Blockchain Developer", growth: "25%", category: "Web3" },
  { name: "Sustainability Specialist", growth: "22%", category: "Green Tech" },
  { name: "AR/VR Experience Designer", growth: "20%", category: "Emerging Tech" },
];

const insightsCards = [
    { 
        id: 'heatmap',
        title: "Skill Demand Heatmap",
        description: "Visualize in-demand skills across different regions.",
        icon: Map,
        placeholderId: "skill-demand-heatmap" 
    },
    { 
        id: 'tech-trends',
        title: "Trending Technologies",
        description: "Discover the tech stacks gaining the most traction.",
        icon: Cpu,
        placeholderId: "trending-tech-chart"
    },
    { 
        id: 'salary-dist',
        title: "Salary Distribution",
        description: "Understand compensation trends for key roles.",
        icon: BarChart,
        placeholderId: "salary-distribution-chart"
    },
];

export default function MarketInsightsPage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Market Insights</h1>
          <p className="text-lg text-muted-foreground mt-2">Your dashboard for the latest job market intelligence.</p>
        </header>

        {/* Main Insights Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Roles Card (Larger) */}
          <Card className="lg:col-span-2 shadow-xl rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp /> Top Trending Roles</CardTitle>
              <CardDescription>Roles with the highest projected growth in the next 12 months.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingRoles.map(role => (
                  <div key={role.name} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/70 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/20 p-2 rounded-lg">
                        <Briefcase className="text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{role.name}</p>
                        <p className="text-sm text-muted-foreground">{role.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <ArrowUpRight size={16} />
                      <span className="font-bold">{role.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Placeholder for a featured insight */}
          <Card className="shadow-xl rounded-2xl flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900/50 dark:to-indigo-900/50">
             <CardHeader>
                <CardTitle>AI's Impact on Tech Jobs</CardTitle>
             </CardHeader>
             <CardContent>
                <p className="text-lg">Read our new special report on how generative AI is reshaping engineering roles.</p>
                <button className="mt-4 font-bold text-primary">Read Report &rarr;</button>
             </CardContent>
          </Card>
        </section>
        
        {/* Gallery of Charts */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-6">Interactive Data Visualizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {insightsCards.map(card => {
                const placeholder = PlaceHolderImages.find(p => p.id === card.placeholderId);
                return (
                    <Card key={card.id} className="shadow-lg rounded-2xl overflow-hidden group">
                        {placeholder && <Image src={placeholder.imageUrl} alt={card.title} width={600} height={400} data-ai-hint={placeholder.imageHint} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />}
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><card.icon size={20} />{card.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{card.description}</p>
                        </CardContent>
                    </Card>
                )
            })}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
