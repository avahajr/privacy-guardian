import { Goal } from "@/types";

export function useStorage(): {
  goals: Goal[] | null;
  policy: string | null;
  policy_html: string | null;
} {
  return {
    goals: JSON.parse(sessionStorage.getItem("goals") || "null"),
    policy: sessionStorage.getItem("policy"),
    policy_html: sessionStorage.getItem("policy_html"),
  };
}
