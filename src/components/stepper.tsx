import { Link } from "react-router-dom";

const Step = ({
  stepNum,
  label,
  isActive,
  hasLine,
}: {
  stepNum: number;
  label: string;
  isActive: boolean;
  hasLine: boolean;
}) => {
  return (
    <div className={"block w-full"}>
      <div className="flex items-center gap-2">
        <div
          className={`flex justify-center items-center min-h-9 min-w-9 bg-purple-700 ${isActive ? "text-white" : "bg-opacity-10 dark:bg-opacity-30 text-default-400"}  rounded-full`}
        >
          <span>{stepNum}</span>
        </div>
        {hasLine && <div className="w-4/5 mx-2 h-0.5 bg-default-300" />}
      </div>
      <div className={`font-semibold mt-1 ${!isActive && "text-default-300"}`}>
        {label}
      </div>
    </div>
  );
};

export default function HorizontalStepper({
  activeStep,
}: {
  activeStep: number;
}) {
  return (
    <div className={"flex justify-between items-center mr-20"}>
      <Link className={"grow"} to={"/"}>
        <Step
          hasLine={true}
          isActive={activeStep === 1}
          label={"Select policy"}
          stepNum={1}
        />
      </Link>
      <Link className={"grow"} to={"/goals"}>
        <Step
          hasLine={true}
          isActive={activeStep === 2}
          label={"Set goals"}
          stepNum={2}
        />
      </Link>
      <Link className={"grow"} to={"/breakdown"}>
        <Step
          hasLine={false}
          isActive={activeStep === 3}
          label={"Analyze tradeoffs"}
          stepNum={3}
        />
      </Link>
    </div>
  );
}
