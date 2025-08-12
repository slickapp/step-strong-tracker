import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ensureHealthPermissions, fetchLast7DaysSteps, StepDay } from "@/plugins/lovable-healthkit";

const muscles = [
  { key: "chest", label: "Chest" },
  { key: "back", label: "Back" },
  { key: "legs", label: "Legs" },
  { key: "arms", label: "Arms" },
  { key: "shoulders", label: "Shoulders" },
];

const Index = () => {
  const [steps, setSteps] = useState<StepDay[]>([]);
  const [auth, setAuth] = useState<"unknown" | "granted" | "denied">("unknown");
  const total = useMemo(() => steps.reduce((s, d) => s + d.steps, 0), [steps]);

  useEffect(() => {
    (async () => {
      console.log('[Home] Initializing HealthKit...');
      const granted = await ensureHealthPermissions();
      setAuth(granted ? 'granted' : 'denied');
      const data = await fetchLast7DaysSteps();
      setSteps(data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="container py-8">
        <h1 className="text-2xl font-semibold">Daily Steps & Workouts</h1>
        <p className="text-sm text-muted-foreground mt-1">iOS HealthKit integration with custom Capacitor plugin</p>
      </header>

      <main className="container space-y-8 pb-12">
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days Steps</CardTitle>
          </CardHeader>
          <CardContent>
            {auth === 'denied' && (
              <p className="text-sm text-destructive">Health permissions denied. Enable Health access in Settings.</p>
            )}
            <div className="grid grid-cols-7 gap-2 mt-4">
              {steps.map((d, i) => {
                const date = new Date(d.date);
                const label = `${date.getMonth() + 1}/${date.getDate()}`;
                return (
                  <div key={i} className="flex flex-col items-center rounded-md border p-2">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium">{d.steps}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">Total: <span className="font-medium text-foreground">{total}</span> steps</div>
          </CardContent>
        </Card>

        <section>
          <h2 className="text-lg font-medium mb-4">Workouts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {muscles.map((m) => (
              <Link key={m.key} to={`/workout/${m.key}`} className="block">
                <Button className="w-full" variant="secondary">{m.label}</Button>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
