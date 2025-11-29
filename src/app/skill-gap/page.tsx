'use client';

import AppLayout from "@/components/AppLayout";
import GradientButton from "@/components/GradientButton";
import TagInput from "@/components/TagInput";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { analyzeSkillGap } from "@/ai/flows/analyze-skill-gap";
import { Book, Lightbulb, Loader, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const skillGapSchema = z.object({
  jobRole: z.string().min(3, "Job role is required"),
  userSkills: z.array(z.string()).min(1, "Please enter at least one skill"),
});

type SkillGapFormData = z.infer<typeof skillGapSchema>;

type SkillGapResult = {
  matchScore: number;
  missingSkills: string[];
  recommendedSkills: string[];
  skillGapSummary: string;
};

export default function SkillGapPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SkillGapResult | null>(null);
  const { toast } = useToast();

  const { control, handleSubmit, formState: { errors } } = useForm<SkillGapFormData>({
    resolver: zodResolver(skillGapSchema),
    defaultValues: {
      jobRole: "",
      userSkills: [],
    },
  });

  const onSubmit = async (data: SkillGapFormData) => {
    setIsLoading(true);
    setResult(null);
    try {
      // Dummy AI call
      // const response = await analyzeSkillGap(data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const allSkills = ["React", "TypeScript", "Node.js", "GraphQL", "Docker", "Kubernetes", "AWS", "SQL"];
      const missing = allSkills.filter(s => !data.userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase()));
      const response = {
        missingSkills: missing.slice(0, 3),
        recommendedSkills: ["Python", "Machine Learning", "System Design"],
        skillGapSummary: "You have a strong foundation in frontend technologies but could benefit from strengthening your backend and cloud skills to better match the Senior Software Engineer role."
      };

      const matchScore = Math.round(((data.userSkills.length) / allSkills.length) * 100);
      setResult({ ...response, matchScore });

    } catch (error) {
      console.error("Skill gap analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze skill gap. Please try again.",
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
            <CardTitle className="text-3xl font-bold">Skill Gap Analyzer</CardTitle>
            <CardDescription>Enter a job role and your skills to find what's missing.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Controller
                name="jobRole"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">Target Job Role</Label>
                    <Input id="jobRole" placeholder="e.g., Senior Software Engineer" {...field} />
                    {errors.jobRole && <p className="text-sm text-destructive">{errors.jobRole.message}</p>}
                  </div>
                )}
              />
              <Controller
                name="userSkills"
                control={control}
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>Your Skills</Label>
                    <TagInput
                      {...field}
                      placeholder="Add your skills and press Enter"
                    />
                    {errors.userSkills && <p className="text-sm text-destructive">{errors.userSkills.message}</p>}
                  </div>
                )}
              />
              <GradientButton type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : <><Sparkles className="mr-2" />Analyze Skills</>}
              </GradientButton>
            </form>
          </CardContent>
        </Card>

        {(isLoading || result) && (
          <div className="w-full max-w-4xl mt-8 animate-slide-in">
            <h2 className="text-2xl font-bold text-center mb-6">Analysis Results</h2>
            {isLoading ? (
              <div className="flex justify-center items-center p-8"><Loader className="w-12 h-12 animate-spin text-primary" /></div>
            ) : result && (
              <div className="grid grid-cols-1 gap-6">
                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle>Skill Match Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Progress value={result.matchScore} className="h-4" />
                      <span className="text-2xl font-bold text-indigo-500">{result.matchScore}%</span>
                    </div>
                    <p className="text-muted-foreground mt-4">{result.skillGapSummary}</p>
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lightbulb size={20} /> Missing Skills</CardTitle>
                    <CardDescription>Key skills required for this role that are not in your list.</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-3">
                    {result.missingSkills.map((skill, index) => (
                      <Badge key={index} className="px-4 py-2 text-base rounded-lg bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
                        {skill}
                      </Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Book size={20} /> Recommended Skills to Learn</CardTitle>
                    <CardDescription>Expand your skillset with these valuable technologies.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.recommendedSkills.map((skill, index) => (
                      <div key={index} className="p-4 rounded-lg bg-secondary/50">
                        <h4 className="font-semibold">{skill}</h4>
                      </div>
                    ))}
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
