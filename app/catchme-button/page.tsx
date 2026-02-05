"use client";

import { Button } from "@/components/catchmebutton/catchme-button";

export default function CatchMeButton() {
  return (
    <>
    <div className="flex min-h-screen items-center justify-center gap-4">
      <Button evade variant="default" size="lg">
        Catch me! 🏃‍♂️
      </Button>
      </div>
        <div className="flex min-h-screen items-center justify-center gap-4">
      {/* Normal button */}
      <Button variant="default">
        Regular Button
      </Button>
      </div>
      <div className="flex min-h-screen items-center justify-center gap-4">
      {/* Custom parameters */}
      <Button 
        evade 
        evadeDistance={200}
        evadeThreshold={120}
      >
        Super Fast!
      </Button>
    </div>
    </>
  );
}
