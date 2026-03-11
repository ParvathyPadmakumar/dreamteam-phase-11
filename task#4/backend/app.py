from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import os
from dotenv import load_dotenv

app=Flask(__name__)
CORS(app)
load_dotenv()
app.config['JWT_SECRET_KEY']=os.getenv('JWT_SECRET_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES']=timedelta(days=1)
jwt=JWTManager(app)
users={"user@domain.com": {"password": "password123", "id": 1}}
events = {}
next_event_id=1
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    if email in users:
        return jsonify({"error": "User already exists"}), 400
    users[email] = {"password": password, "id": len(users) + 1}
    access_token = create_access_token(identity=email)
    return jsonify({"access_token": access_token, "email": email}), 201
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
    user = users.get(email)
    if not user or user['password'] != password:
        return jsonify({"error": "Invalid credentials"}), 401
    access_token = create_access_token(identity=email)
    return jsonify({"access_token": access_token, "email": email}), 200
@app.route('/api/events', methods=['POST'])
@jwt_required()
def createevent():
    global next_event_id
    data=request.get_json()
    email=get_jwt_identity()
    event = {
        "id": next_event_id,
        "name": data.get('name'),
        "completedDates": []
    }
    next_event_id+=1
    user_events=events.get(email,[])
    user_events.append(event)
    events[email]=user_events
    return jsonify(event),201

@app.route('/api/events', methods=['GET'])
@jwt_required()
def getevents():
    email=get_jwt_identity()
    userevents=events.get(email, [])
    normalizedevents = [
        {"id": event.get("id"),
            "name": event.get("name"),
            "completedDates": event.get("completedDates",event.get("completeddates",[]))
        }
        for event in userevents]
    return jsonify({"events": normalizedevents}), 200

@app.route('/api/events/<int:event_id>', methods=['PUT'])
@jwt_required()
def updateevent(event_id):
    data=request.get_json() or {}
    email=get_jwt_identity()
    completed_dates = data.get('completedDates')
    if completed_dates is None:
        completed_dates = data.get('completeddates', [])

    user_events = events.get(email, [])
    for event in user_events:
        if event["id"] == event_id:
            event["completedDates"] = completed_dates
            return jsonify(event), 200

    return jsonify({"error": "Event not found"}), 404

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
@jwt_required()
def deleteevent(event_id):
    email=get_jwt_identity()
    user_events=events.get(email, [])
    for i, event in enumerate(user_events):
        if event["id"] == event_id:
            del user_events[i]
            events[email]=user_events
            return jsonify({"message": "Event deleted successfully"}), 200
    return jsonify({"error": "Event not found"}), 404
if __name__ == '__main__':
    app.run(debug=True,port=5000)











