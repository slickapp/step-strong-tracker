import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface SetEntry {
  reps: number;
  weight: number; // kg
}

const Workout = () => {
  const { muscle } = useParams<{ muscle: string }>();
  const [reps, setReps] = useState<number>(10);
  const [weight, setWeight] = useState<number>(20);
  const [sets, setSets] = useState<SetEntry[]>([]);

  const totalWeight = useMemo(
    () => sets.reduce((sum, s) => sum + s.reps * s.weight, 0),
    [sets]
  );

  const addSet = () => {
    console.log('[Workout] Adding set', { reps, weight });
    if (reps > 0 && weight >= 0) {
      setSets((prev) => [...prev, { reps, weight }]);
    }
  };

  const clearAll = () => {
    console.log('[Workout] Clearing all sets');
    setSets([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="container py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="inline-flex">
            <Button variant="secondary">Back</Button>
          </Link>
          <h1 className="text-xl font-semibold">
            {muscle ? muscle.charAt(0).toUpperCase() + muscle.slice(1) : 'Workout'} Session
          </h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="container flex-1 pb-28">
        <Card>
          <CardHeader>
            <CardTitle>Track Sets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Reps</label>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setReps((v) => Math.max(0, v - 1))}>-</Button>
                  <Input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                  />
                  <Button variant="secondary" onClick={() => setReps((v) => v + 1)}>+</Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Weight (kg)</label>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setWeight((v) => Math.max(0, v - 2.5))}>-</Button>
                  <Input
                    type="number"
                    step={0.5}
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                  <Button variant="secondary" onClick={() => setWeight((v) => v + 2.5)}>+</Button>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addSet}>Add Set</Button>
              <Button variant="outline" onClick={clearAll}>Clear</Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <h2 className="font-medium">Sets</h2>
              {sets.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sets yet. Add your first set above.</p>
              ) : (
                <ul className="space-y-2">
                  {sets.map((s, i) => (
                    <li key={i} className="flex items-center justify-between rounded-md border p-3">
                      <span className="text-sm">Set {i + 1}</span>
                      <span className="text-sm text-muted-foreground">{s.reps} reps × {s.weight} kg</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="fixed bottom-0 inset-x-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total weight lifted</p>
            <p className="text-xl font-semibold">{totalWeight.toFixed(1)} kg</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={clearAll}>Reset</Button>
            <Button>Finish</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Workout;
