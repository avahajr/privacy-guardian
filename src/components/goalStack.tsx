const goal = (goal:string) => (
  <div className="p-3 border rounded-md goal flex justify-between">
    <div className="goal-content">
      {goal}
    </div>
    <i className="bi bi-trash3" />
  </div>
);

export default function GoalStack() {
  return <div className="relative flex flex-col h-screen">{goal("Some content here")}</div>;
}
