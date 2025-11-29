import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppSidebar />
      <main className="pl-24 pr-8 py-8 md:pl-28 md:pr-10 md:py-10">
        <div className="max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
