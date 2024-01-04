from flask import jsonify, request
from application import app, jwt, socketio
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity


@socketio.on("connect")
@jwt_required()
def handle_connect():
    # Automatically triggered when a client connects
    try:
        user_id = get_jwt_identity()
        print(f"User {user_id} connected")
    except Exception as e:
        print("Error: ", e)


@socketio.on("disconnect")
@jwt_required()
def handle_disconnect():
    user_id = get_jwt_identity()
    print(f"User {user_id} disconnected")
