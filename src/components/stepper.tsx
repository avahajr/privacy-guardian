import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface HorizontalStepperProps {
  className?: string;
  activeStep: number;
}

export default function HorizontalStepper({
  className, activeStep
}: HorizontalStepperProps) {
  return (
    <Stepper alternativeLabel activeStep={activeStep} className={className}>
      <Step>
        <StepLabel className="text-default-600">Step 1</StepLabel>
      </Step>
      <Step>
        <StepLabel className="text-default-600">Step 2</StepLabel>
      </Step>
      <Step>
        <StepLabel className="text-default-600">Step 3</StepLabel>
      </Step>
    </Stepper>
  );
}