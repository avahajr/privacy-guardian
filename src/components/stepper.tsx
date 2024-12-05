import { Link } from "react-router-dom";

const Step = ({
  stepNum,
  label,
  currStep,
  hasLine,
  className,
}: {
  stepNum: number;
  label: string;
  currStep: number;
  hasLine: boolean;
  className?: string;
}) => {
  return (
    <div className={`block w-full ${className}`}>
      <div className="flex items-center gap-2">
        <div
          className={`flex justify-center items-center min-h-9 min-w-9 bg-purple-700 ${stepNum === currStep ? "text-white" : "bg-opacity-10 dark:bg-opacity-30 text-default-400"}  rounded-full`}
        >
          <span>
            {currStep <= stepNum ? stepNum : <i className="bi bi-check" />}
          </span>
        </div>
        {hasLine && <div className="w-4/5 mx-2 h-0.5 bg-default-300" />}
      </div>
      <div
        className={`font-semibold mt-1 ${stepNum !== currStep && "text-default-300"}`}
      >
        {label}
      </div>
    </div>
  );
};

export default function HorizontalStepper({
  activeStep,
  className,
}: {
  activeStep: number;
  className?: string;
}) {
  return (
    <div
      className={`flex mx-auto justify-between items-center mr-20 ${className}`}
    >
      <Link className={"grow"} to={"/"}>
        <Step
          currStep={activeStep}
          hasLine={true}
          label={"Select policy"}
          stepNum={1}
        />
      </Link>
      <Link className={"grow"} to={"/goals"}>
        <Step
          currStep={activeStep}
          hasLine={true}
          label={"Set goals"}
          stepNum={2}
        />
      </Link>
      <Link className={"grow"} to={"/breakdown"}>
        <Step
          hasLine={false}
          currStep={activeStep}
          label={"Analyze tradeoffs"}
          stepNum={3}
        />
      </Link>
    </div>
  );
}
