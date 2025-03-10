import { Navbar } from "@/components/navbar";
import HorizontalStepper from "@/components/stepper.tsx";

export default function DefaultLayout({
  children,
  width,
  activeStep,
}: {
  children: React.ReactNode;
  width: number;
  activeStep: number;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main
        className={`container mx-auto max-w-${width}xl px-6 flex-grow pt-16`}
      >
        {activeStep > 1 && (
          <HorizontalStepper
            activeStep={activeStep}
            className={"max-w-5xl pb-5"}
          />
        )}
        {children}
      </main>
    </div>
  );
}
