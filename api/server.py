from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import sys
import os

from pydantic import ValidationError

# include /api in the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.gpt import GPT, GoalSummary, GoalWithCitedSummary

load_dotenv()

env = os.getenv("ENV")
print(f"Running in {env} environment")

template_folder = "../dist" if env == "dev" else "/"
static_folder = "../dist/assets" if env == "dev" else "/assets"

app = Flask(__name__, template_folder=template_folder, static_folder=static_folder,
            static_url_path="/assets")

CORS(app, origins="*")

goals = []
client = GPT("Apple")
selected_policy = None


@app.before_request
def set_globals():
    global goals, selected_policy, client
    if request.is_json:
        print("preflight change globals")
        data = request.get_json()
        if 'policy' in data:
            selected_policy = data['policy']
            client.change_policy(selected_policy)
        if 'goals' in data:
            try:
                goals = [GoalSummary(goal=goal['goal'], rating=goal.get('rating'), summary=goal.get('summary')) for goal in
                         data['goals']]
            except ValidationError:
                goals = [GoalWithCitedSummary(goal=goal['goal'], rating=goal.get('rating'), summary=goal.get('summary')) for goal in data['goals']]


def allow_cors(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


def pydantic_jsonfiy(obj):
    if isinstance(obj, list):
        return jsonify([item.model_dump() for item in obj])

    return jsonify(obj.model_dump())


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


@app.route("/api/goals/rating", methods=["POST"])
def get_goal_ratings():
    global client, goals
    if goals[0].rating is None:
        goals = client.rate_goals(goals)

    goals.sort(key=lambda x: x.rating, reverse=True)
    response = pydantic_jsonfiy(goals)

    return allow_cors(response)


@app.route("/api/summary/<id>", methods=["POST"])
def get_summary(id: int):
    global client, goals
    if int(id) >= len(goals):
        return jsonify({"msg": "goal not found"})

    if isinstance(goals[int(id)], GoalSummary) and goals[int(id)].summary is None:
        summary = client.summarize_goal(goals[int(id)])
        goals[int(id)] = summary

    response = pydantic_jsonfiy(goals[int(id)])

    return allow_cors(response)


@app.route("/api/cite/summary/<id>", methods=["POST"])
def get_cited_summary(id: int):
    global client, goals
    # if the goal has already been cited, return it
    if isinstance(goals[int(id)], GoalWithCitedSummary):
        return pydantic_jsonfiy(goals[int(id)])

    cited_summary = client.cite_summary(goals[int(id)])

    goals[int(id)] = cited_summary
    response = pydantic_jsonfiy(cited_summary)

    return allow_cors(response)


@app.route("/api/html/policy", methods=["POST"])
def get_policy_html():
    response = jsonify({"policy_html": client.policy_html})
    return response


if __name__ == "__main__":
    app.run(port=8000)
