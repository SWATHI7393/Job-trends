'use client';

import AppLayout from "@/components/AppLayout";
import GradientButton from "@/components/GradientButton";
import TagInput from "@/components/TagInput";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { predictJobTrend } from "@/ai/flows/predict-job-trend";
import { BarChart, Gauge, LineChart, Loader, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const predictionSchema = z.object({
  jobRole: z.string().min(3, "Job role must be at least 3 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  experienceLevel: z.array(z.number()),
  skills: z.array(z.string()).min(1, "Please add at least one skill"),
});

type PredictionFormData = z.infer<typeof predictionSchema>;

type PredictionResult = {
  jobDemandScore: number;
  salaryForecast: string;
  hiringTrendChart: string;
  skillGapChart: string;
};

const hiringTrendChartPlaceholder = PlaceHolderImages.find(p => p.id === 'hiring-trend-chart')!;
const skillGapChartPlaceholder = PlaceHolderImages.find(p => p.id === 'skill-gap-chart')!;

export default function PredictTrendPage() {
  const [experience, setExperience] = useState([3]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<PredictionFormData>({
    resolver: zodResolver(predictionSchema),
    defaultValues: {
      jobRole: "",
      location: "",
      experienceLevel: [3],
      skills: [],
    },
  });

  const onSubmit = async (data: PredictionFormData) => {
    setIsLoading(true);
    setResult(null);

    const experienceLevelMap = ["Entry-level", "Mid-level", "Senior", "Lead", "Principal"];
    const input = {
      ...data,
      experienceLevel: experienceLevelMap[data.experienceLevel[0]],
    };

    try {
      // Dummy AI call for demonstration
      // const response = await predictJobTrend(input);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = {
        jobDemandScore: Math.floor(Math.random() * 41) + 60,
        salaryForecast: `$${(Math.random() * 50 + 90).toFixed(0)}k - $${(Math.random() * 60 + 150).toFixed(0)}k`,
        hiringTrendChart: hiringTrendChartPlaceholder.imageUrl,
        skillGapChart: skillGapChartPlaceholder.imageUrl,
      };
      setResult(response);
    } catch (error) {
      console.error("Prediction failed:", error);
      toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not generate job trend prediction. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full">
        <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Predict Job Trends</CardTitle>
            <CardDescription>Enter job details to forecast market demand and salary.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="jobRole"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">Job Role</Label>
                    <Input id="jobRole" placeholder="e.g., Software Engineer" {...field} />
                    {errors.jobRole && <p className="text-sm text-destructive">{errors.jobRole.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="location"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="e.g., San Francisco, CA" {...field} />
                    {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="experienceLevel"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div className="space-y-2">
                    <Label>Experience Level: {['Entry', 'Mid', 'Senior', 'Lead', 'Principal'][value[0]]}</Label>
                    <Slider
                      defaultValue={[3]}
                      min={0}
                      max={4}
                      step={1}
                      onValueChange={onChange}
                    />
                  </div>
                )}
              />
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <TagInput
                      {...field}
                      placeholder="Add skills and press Enter"
                    />
                    {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
                  </div>
                )}
              />
              <GradientButton type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : <><Sparkles className="mr-2" />Predict Trend</>}
              </GradientButton>
            </form>
          </CardContent>
        </Card>

        {(isLoading || result) && (
          <div className="w-full mt-8 animate-slide-in">
            <h2 className="text-2xl font-bold text-center mb-6">Prediction Results</h2>
            {isLoading ? (
              <div className="flex justify-center items-center p-8"><Loader className="w-12 h-12 animate-spin text-primary" /></div>
            ) : result && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Job Demand Score</CardTitle>
                    <Gauge className="text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-indigo-500">{result.jobDemandScore}/100</div>
                    <p className="text-xs text-muted-foreground mt-2">Based on current market signals</p>
                  </CardContent>
                </Card>
                <Card className="shadow-lg rounded-2xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Salary Forecast</CardTitle>
                    <span className="text-2xl">💰</span>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-green-600">{result.salaryForecast}</div>
                    <p className="text-xs text-muted-foreground mt-2">Estimated annual salary range</p>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><LineChart size={20}/> Hiring Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image src={result.hiringTrendChart} alt="Hiring trend chart" width={800} height={400} className="rounded-lg" data-ai-hint="line chart" />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-2 shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart size={20}/> Top Skills Gap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Image src={result.skillGapChart} alt="Skill gap chart" width={800} height={400} className="rounded-lg" data-ai-hint="bar chart" />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
