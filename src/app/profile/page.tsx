import AppLayout from "@/components/AppLayout";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Download, FileText, Star } from "lucide-react";

const user = {
  name: "Alex Doe",
  email: "alex.doe@example.com",
  initials: "AD",
  avatarUrl: PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || '',
};

const savedPredictions = [
  { id: 1, title: "Data Scientist in NY", date: "2023-10-15", score: 85 },
  { id: 2, title: "Frontend Dev in Remote", date: "2023-10-12", score: 92 },
  { id: 3, title: "UX Designer in SF", date: "2023-10-10", score: 78 },
];

export default function ProfilePage() {
  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 border-4 border-primary/50">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
            <AvatarFallback className="text-3xl">{user.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold">{user.name}</h1>
            <p className="text-lg text-muted-foreground">{user.email}</p>
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Saved Predictions */}
          <section className="lg:col-span-2">
            <Card className="shadow-xl rounded-2xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Star /> Saved Predictions</CardTitle>
                <CardDescription>Review and manage your past trend analyses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedPredictions.map(pred => (
                    <div key={pred.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/70">
                      <div>
                        <p className="font-semibold">{pred.title}</p>
                        <p className="text-sm text-muted-foreground">Predicted on {pred.date}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-lg text-primary">{pred.score}</p>
                         <p className="text-xs text-muted-foreground">Demand Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Settings and Reports */}
          <aside className="space-y-8">
            <Card className="shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Theme</p>
                  <ThemeToggle />
                </div>
                 <div className="flex items-center justify-between mt-4">
                  <p className="font-medium">Notifications</p>
                  <Button variant="outline">Manage</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Reports</CardTitle>
                <CardDescription>Download your data and insights.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                 <Button variant="outline" className="w-full justify-between">
                    Download All Predictions <Download size={16}/>
                 </Button>
                 <Button variant="outline" className="w-full justify-between">
                    Export Profile Data <Download size={16}/>
                 </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </AppLayout>
  );
}
