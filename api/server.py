from flask import Flask, request, jsonify

app = Flask(__name__)

selected_policy = "Apple"
goals = [{"goal": "Don't sell my data"}, {"goal": "Don't give my data to law enforcement"},
         {"goal": "Allow me to delete my data"}]

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

@app.route("/api/policy", methods=["GET"])
def get_policy():
    return jsonify({"policy": selected_policy})

@app.route("/api/policy", methods=["PUT"])
def update_policy():
    global selected_policy
    data = request.get_json()
    selected_policy = data['policy']
    return jsonify({"policy": selected_policy})

@app.route("/api/html/policy", methods=["GET"])
def get_policy_html():
    return jsonify({"policy": selected_policy})