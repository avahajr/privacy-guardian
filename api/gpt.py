from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel
import os
import re


class Rating(BaseModel):
    rating: int


class GoalSummary(BaseModel):
    goal: str
    rating: int | None = None
    summary: str | None = None


class CitedSentence(BaseModel):
    """Sentence mapped to the spans of the original text that it was generated from."""
    sentence: str
    quote_locations: list[list[int]]


class QuoteLocations(BaseModel):
    locs: list[int]


class GoalWithCitedSummary(BaseModel):
    goal: str
    rating: int
    cited_sentences: list[CitedSentence]


def split_paragraph_into_sentences(paragraph: GoalSummary):
    # Regular expression to match sentence endings
    print(paragraph)
    sentence_endings = re.compile(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?)\s')
    sentences = sentence_endings.split(paragraph.summary)
    return sentences


def group_consecutive_citations(quote_locations: list[int]) -> list[list[int]]:
    grouped_locations = []
    current_group = []

    for loc in quote_locations:
        if not current_group or loc == current_group[-1] + 1:
            current_group.append(loc)
        else:
            grouped_locations.append(current_group)
            current_group = [loc]

    if current_group:
        grouped_locations.append(current_group)

    return grouped_locations


class GPT:
    def __init__(self, policy_name: str):
        load_dotenv()
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.policy_name = policy_name
        self.system_message = {
            "role": "system",
            "content": "You are a helpful assistant trying to help a user understand the privacy policy they are signing. Read policies with skepticism. Provide minimal, no-fluff answers."}
        self.policy_html = self.retrieve_policy_text()
        self.assistant_message = {
            "role": "assistant",
            "content": f"Here is the privacy policy for {self.policy_name}: \n{self.policy_html}"}

    def change_policy(self, policy_name: str):
        self.policy_name = policy_name
        self.policy_html = self.retrieve_policy_text()
        self.assistant_message = {
            "role": "assistant",
            "content": f"Here is the privacy policy for {self.policy_name}: \n{self.policy_html}"}

    def retrieve_policy_text(self):
        if __name__ != "__main__":
            with open(f'public/policies/{self.policy_name.lower()}.html', 'r') as f:
                policy_text = f.read()
        if __name__ == "__main__":
            with open(f'../public/policies/{self.policy_name.lower()}.html', 'r') as f:
                policy_text = f.read()
        return policy_text

    def rate_goals(self, goals) -> list[GoalSummary]:
        goal_ratings = []
        for goal in goals:
            prompt = (f"Is the following goal met by the provided privacy policy?\n'{goal}'"
                      f"\n\nRating scale:0 (fully met) to 2 (not met)")

            # print("Asking GPT: ", prompt)
            response = self.client.beta.chat.completions.parse(
                model="gpt-4o-mini",
                messages=[
                    self.system_message,
                    self.assistant_message,
                    {"role": "user", "content": prompt}
                ],
                response_format=Rating,
            )
            goal_rating = response.choices[0].message.parsed
            goal_ratings.append(GoalSummary(goal=goal.goal, rating=goal_rating.rating))
        return goal_ratings

    def summarize_goal(self, goal: GoalSummary) -> GoalSummary:

        match goal.rating:
            case 0:
                num_paragraphs = 1
            case 1:
                num_paragraphs = 2
            case 2:
                num_paragraphs = 3
            case _:
                num_paragraphs = 1

        user_message = {"role": "user",
                        "content": f"This the goal\n {goal.goal} has a rating of {goal.rating} \nRating scale: 0 (fully met) to 2 (not met)"
                                   f"\nWithout mentioning the underlying rating,"
                                   f"in {num_paragraphs} short paragraphs, summarize the policy's compliance with this goal."}
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                self.system_message,
                self.assistant_message,
                user_message
            ],
        )

        return GoalSummary(goal=goal.goal, rating=goal.rating, summary=response.choices[0].message.content)

    def cite_summary(self, goal: GoalSummary) -> GoalWithCitedSummary:
        sentences = split_paragraph_into_sentences(goal)
        cited_summary = []
        for sentence in sentences:
            user_message = {"role": "user",
                            "content": f"Cite the supporting evidence for a sentence (which is from a summary):\n '{sentence}'\n"
                                       f"in the original policy text. Return the ids of the spans(s) which contain the evidence sentence in the policy."}
            response = self.client.beta.chat.completions.parse(
                model="gpt-4o-mini-2024-07-18",
                messages=[
                    self.system_message,
                    self.assistant_message,
                    user_message
                ],
                response_format=QuoteLocations,
            )
            quote_location = response.choices[0].message.parsed
            cited_summary.append(
                CitedSentence(sentence=sentence, quote_locations=group_consecutive_citations(quote_location.locs)))

        return GoalWithCitedSummary(goal=goal.goal, rating=goal.rating, cited_sentences=cited_summary)


if __name__ == "__main__":
    testGPT = GPT("apple")
    my_goals = [GoalSummary(goal=goal) for goal in
                ["do not sell my personal information", "opt out of data sharing", "data security"]]
    goal_ratings = testGPT.rate_goals(my_goals)
    print([goal.model_dump() for goal in goal_ratings])

    goal_summaries = []
    for goal in goal_ratings:
        summary = testGPT.summarize_goal(goal)
        goal_summaries.append(summary)

    print([summary.model_dump() for summary in goal_summaries])

    print(testGPT.cite_summary(goal_summaries[0]))
