from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

from gpt import GPT, GoalSummary, GoalWithCitedSummary

app = Flask(__name__)
CORS(app)

selected_policy = "Apple"
client = GPT(selected_policy)

goals = [GoalSummary(goal=goal) for goal in
         ["Don't sell my data", "Don't give my data to law enforcement", "Allow me to delete my data"]]


def pydantic_jsonfiy(obj):
    if isinstance(obj, list):
        return jsonify([item.model_dump() for item in obj])

    return jsonify(obj.model_dump())


@app.route("/api/goals", methods=["GET"])
def get_goals():
    global goals
    response = pydantic_jsonfiy(goals)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/api/goals", methods=["POST"])
@cross_origin()
def add_goal():
    global goals
    data = request.get_json()
    goals.append(GoalSummary(goal=data['goal']['goal']))
    response = pydantic_jsonfiy(goals)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


@app.route("/api/goals", methods=["DELETE"])
@cross_origin()
def delete_goal():
    global goals
    data = request.get_json()
    goals = [goal for goal in goals if goal.goal != data['goal']]
    return pydantic_jsonfiy(goals)


@app.route("/api/goals/rating", methods=["GET"])
@cross_origin()
def get_goal_ratings():
    global client
    global goals
    goals = client.rate_goals(goals)
    goals.sort(key=lambda x: x.rating, reverse=True)
    response = pydantic_jsonfiy(goals)

    return response


@app.route("/api/summary/<id>", methods=["GET"])
@cross_origin()
def get_summary(id: int):
    global client
    global goals
    summary = client.summarize_goal(goals[int(id)])
    response = pydantic_jsonfiy(summary)
    goals[int(id)] = summary
    # response.headers.add("Access-Control-Allow-Origin", "*")

    return response


@app.route("/api/cite/summary/<id>", methods=["GET"])
@cross_origin()
def get_cited_summary(id: int):
    global client
    global goals

    cited_summary = client.cite_summary(goals[int(id)])
    goals[int(id)] = cited_summary
    response = pydantic_jsonfiy(cited_summary)
    # response.headers.add("Access-Control-Allow-Origin", "*")

    return response


# return jsonify({"msg":"something went wrong"})

@app.route("/api/policy", methods=["GET"])
@cross_origin()
def get_policy():
    response = jsonify({"policy": selected_policy})

    return response


@app.route("/api/policy", methods=["PUT"])
@cross_origin()
def update_policy():
    global selected_policy
    global client
    data = request.get_json()
    if 'policy' in data:
        selected_policy = data['policy']
        client.change_policy(selected_policy)

    response = jsonify({"policy": selected_policy})

    return response

@app.route("/api/html/policy", methods=["GET"])
@cross_origin()
def get_policy_html():
    response = jsonify({"policy_html": client.policy_html})
    return response


if __name__ == "__main__":
    app.run(port=5000, debug=True)
