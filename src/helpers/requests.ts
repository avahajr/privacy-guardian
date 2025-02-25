import { Goal } from "@/types";

export const getGoalPolicyString = (
  goals: Goal[] | null,
  policy: string | null,
): string => {
  return JSON.stringify({ goals: goals, policy: policy });
};

export function apiRequest({
  endpoint,
  method,
  goals,
  policy,
}: {
  endpoint: string;
  method: string;
  goals?: Goal[];
  policy?: string;
}) {
  return fetch(`/api/${endpoint}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    ...(method === "POST" && goals && policy
      ? { body: JSON.stringify({ goals: goals, policy: policy }) }
      : {}),
  });
}
