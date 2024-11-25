from flask import Flask, request, jsonify
from flask_cors import CORS
from gpt import GPT

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins":
                                     "http://localhost:5173"}})

selected_policy = "Apple"
client = GPT(selected_policy)

goals = [{"goal": "Don't sell my data", "rating": None},
         {"goal": "Don't give my data to law enforcement", "rating": None},
         {"goal": "Allow me to delete my data", "rating": None}]


@app.route("/api/goals", methods=["GET"])
def get_goals():
    global goals
    return jsonify(goals)


@app.route("/api/goals", methods=["POST"])
def add_goal():
    global goals
    data = request.get_json()
    goals.append(data)
    return jsonify(goals)


@app.route("/api/goals", methods=["DELETE"])
def delete_goal():
    global goals
    data = request.get_json()
    goals = [goal for goal in goals if goal['goal'] != data['goal']]
    return jsonify(goals)


@app.route("/api/goals/rating", methods=["GET"])
def get_goal_ratings():
    global client
    global goals
    goal_ratings = client.rate_goals(goals)
    # Convert GoalRating objects to dictionaries
    goal_ratings_dict = [goal_rating.__dict__ for goal_rating in goal_ratings]
    goals = goal_ratings_dict
    print(goals)
    return jsonify(goal_ratings_dict)


@app.route("/api/summary", methods=["GET"])
def get_summary():
    global client
    global goals
    summaries = client.summarize_goals(goals)
    return jsonify(summaries)


@app.route("/api/cite/summary", methods=["GET"])
def get_cited_summary():
    global client
    global goals
    print("goals is:")
    print(goals)

    # if 'rating' in goals[0] and goals[0]['rating']:
    summaries = client.summarize_goals(goals)
    cited_goals = []
    for summary in summaries:
        # print(summary)
        cited_summary = client.cite_summary(summary)
        cited_goals.append([s.__dict__ for s in cited_summary])
    print(cited_goals)
    return jsonify(cited_goals)
# return jsonify({"msg":"something went wrong"})

@app.route("/api/policy", methods=["GET"])
def get_policy():
    return jsonify({"policy": selected_policy})


@app.route("/api/policy", methods=["PUT"])
def update_policy():
    global selected_policy
    global client
    data = request.get_json()
    if 'policy' in data:
        selected_policy = data['policy']
        client.change_policy(selected_policy)

    return jsonify({"policy": selected_policy})


@app.route("/api/html/policy", methods=["GET"])
def get_policy_html():
    return jsonify({"policy_html": client.policy_html})


app.run(port=5000)
