# from genericpath import exists
from application import app, db
from flask import jsonify, request
from Model.Users import Users
from flask_jwt_extended import jwt_required, get_current_user


@app.route("/home", methods=["GET"])
@jwt_required()
def home():
    try:
        print("Request received")
        print("Get user: ", get_current_user())
        id = get_current_user()  # Get customer_id by jwt identity
        print("Id: ", id)
        return jsonify({"userid": id}), 200
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500
