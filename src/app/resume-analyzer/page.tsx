'use client';

import AppLayout from "@/components/AppLayout";
import FileUpload from "@/components/FileUpload";
import GradientButton from "@/components/GradientButton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResume } from "@/ai/flows/analyze-resume";
import { CheckCircle, FileText, Loader, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

const resumeSchema = z.object({
  jobDescription: z.string().min(50, "Job description must be at least 50 characters"),
  resumeFile: z.instanceof(File).refine(file => file.size > 0, "A resume file is required."),
});

type ResumeFormData = z.infer<typeof resumeSchema>;

type ResumeAnalysisResult = {
  extractedSkills: string[];
  jobMatchScore: number;
  atsImprovements: string;
};

// Helper to convert file to data URI
const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function ResumeAnalyzerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const { toast } = useToast();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ResumeFormData>({
    resolver: zodResolver(resumeSchema),
  });

  const handleFile = (file: File) => {
    setValue('resumeFile', file, { shouldValidate: true });
  };

  const onSubmit = async (data: ResumeFormData) => {
    setIsLoading(true);
    setResult(null);

    try {
      const resumeDataUri = await fileToDataUri(data.resumeFile);
      // const response = await analyzeResume({
      //   resumeDataUri,
      //   jobDescription: data.jobDescription,
      // });

      // Dummy AI call
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = {
        extractedSkills: ["React", "JavaScript", "CSS", "HTML", "Git", "Agile Methodologies"],
        jobMatchScore: 78,
        atsImprovements: "Consider adding keywords like 'TypeScript' and 'Next.js' from the job description. Quantify achievements in your project descriptions, for example, 'Improved performance by 30%'."
      };

      setResult(response);
    } catch (error) {
      console.error("Resume analysis failed:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the resume. Please try again.",
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
            <CardTitle className="text-3xl font-bold">Resume Analyzer</CardTitle>
            <CardDescription>Upload your resume and paste a job description to get a match score and improvement tips.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label>Upload Resume</Label>
                <FileUpload onFileUpload={handleFile} className="mt-2" />
                <input type="file" {...register("resumeFile")} className="hidden" />
                {errors.resumeFile && <p className="text-sm text-destructive mt-2">{errors.resumeFile.message}</p>}
              </div>

              <div>
                <Label htmlFor="jobDescription">Job Description</Label>
                <Textarea
                  id="jobDescription"
                  {...register("jobDescription")}
                  placeholder="Paste the job description here..."
                  className="mt-2 min-h-[150px]"
                />
                {errors.jobDescription && <p className="text-sm text-destructive mt-2">{errors.jobDescription.message}</p>}
              </div>

              <GradientButton type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader className="animate-spin" /> : <><Sparkles className="mr-2" />Analyze Resume</>}
              </GradientButton>
            </form>
          </CardContent>
        </Card>

        {(isLoading || result) && (
          <div className="w-full max-w-4xl mt-8 animate-slide-in">
            <h2 className="text-2xl font-bold text-center mb-6">Analysis Report</h2>
            {isLoading ? (
              <div className="flex justify-center items-center p-8"><Loader className="w-12 h-12 animate-spin text-primary" /></div>
            ) : result && (
              <div className="grid grid-cols-1 gap-6">
                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle>Job Match Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <Progress value={result.jobMatchScore} className="h-4" />
                      <span className="text-2xl font-bold text-indigo-500">{result.jobMatchScore}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText size={20} /> Extracted Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-wrap gap-2">
                    {result.extractedSkills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">{skill}</Badge>
                    ))}
                  </CardContent>
                </Card>

                <Card className="shadow-lg rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CheckCircle size={20} /> ATS Improvement Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground whitespace-pre-line">{result.atsImprovements}</p>
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
