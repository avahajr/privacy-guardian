
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from gpt import GPT, GoalSummary, GoalWithCitedSummary

app = Flask(__name__)
CORS(app, origins="*")

selected_policy = "Apple"
client = GPT(selected_policy)

goals = [GoalSummary(goal=goal) for goal in
         ["Don't sell my data", "Don't give my data to law enforcement", "Allow me to delete my data"]]

def allow_cors(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def pydantic_jsonfiy(obj):
    if isinstance(obj, list):
        return jsonify([item.model_dump() for item in obj])

    return jsonify(obj.model_dump())


@app.route("/api/goals", methods=["GET"])

def get_goals():
    global goals
    response = pydantic_jsonfiy(goals)
    return allow_cors(response)


@app.route("/api/goals", methods=["POST"])

def add_goal():
    global goals
    data = request.get_json()
    goals.append(GoalSummary(goal=data['goal']['goal']))
    response = pydantic_jsonfiy(goals)
    return allow_cors(response)


@app.route("/api/goals", methods=["DELETE"])

def delete_goal():
    global goals
    data = request.get_json()
    goals = [goal for goal in goals if goal.goal != data['goal']['goal']]
    return allow_cors(pydantic_jsonfiy(goals))


@app.route("/api/goals/rating", methods=["GET"])
def get_goal_ratings():
    global client
    global goals
    if goals[0].rating is None:
        goals = client.rate_goals(goals)

    goals.sort(key=lambda x: x.rating, reverse=True)
    response = pydantic_jsonfiy(goals)

    return allow_cors(response)


@app.route("/api/summary/<id>", methods=["GET"])
def get_summary(id: int):
    global client
    global goals
    if int(id) >= len(goals):
        return jsonify({"msg": "goal not found"})

    if isinstance(goals[int(id)], GoalSummary) and goals[int(id)].summary is None:
        summary = client.summarize_goal(goals[int(id)])
        goals[int(id)] = summary

    response = pydantic_jsonfiy(goals[int(id)])

    return allow_cors(response)

@app.route("/api/cite/summary/<id>", methods=["GET"])

def get_cited_summary(id: int):
    global client
    global goals

    # if the goal has already been cited, return it
    if isinstance(goals[int(id)], GoalWithCitedSummary):
        return pydantic_jsonfiy(goals[int(id)])

    cited_summary = client.cite_summary(goals[int(id)])

    goals[int(id)] = cited_summary
    response = pydantic_jsonfiy(cited_summary)

    return allow_cors(response)


@app.route("/api/policy", methods=["GET"])

def get_policy():
    response = jsonify({"policy": selected_policy})

    return allow_cors(response)


@app.route("/api/policy", methods=["PUT"])

def update_policy():
    global selected_policy
    global client
    data = request.get_json()
    if 'policy' in data:
        selected_policy = data['policy']
        client.change_policy(selected_policy)

    response = jsonify({"policy": selected_policy})

    return allow_cors(response)


@app.route("/api/html/policy", methods=["GET"])

def get_policy_html():
    response = jsonify({"policy_html": client.policy_html})
    return response

@app.route("/api/goals/reset", methods=["DELETE"])

def reset_goals():
    global goals
    goals = [GoalSummary(goal=goal) for goal in
             ["Don't sell my data", "Don't give my data to law enforcement", "Allow me to delete my data"]]
    return pydantic_jsonfiy(goals)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
