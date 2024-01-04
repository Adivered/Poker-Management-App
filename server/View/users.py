# uoutes.py

from application import app, db
from flask import request
from Model.Users import Users
from sqlalchemy.exc import IntegrityError


@app.route("/sign_up", methods=["POST"])
def sign_up():
    """
    Route for user registration.

    Endpoint: /sign_up
    Method: POST

    Parameters (JSON):
    - username (str): User's desired username.
    - password (str): User's password.

    Returns:
    - JSON response containing:
      - approved (bool): True if user registration is successful, False otherwise.
      - msg (str): Message describing the result of the registration.

    """
    username = request.json.get("username")
    password = request.json.get("password")
    firstname = request.json.get("firstname")
    lastname = request.json.get("lastname")
    email = request.json.get("email")
    phonenumber = request.json.get("phonenumber")
    profile_picture = request.json.get("profilepicture")

    if Users.user_exist(username):
        return {"approved": False, "msg": "Username already exists"}, 401
    else:
        new_user = Users(
            username=username,
            password=password,  # Make sure to hash the password before storing it
            first_name=firstname,
            last_name=lastname,
            phone=phonenumber,
            email=email,
            profile_picture=profile_picture,
            cash=1000,
            profit=0,
            loss=0,
            status=0,
        )

        db.session.add(new_user)

        try:
            db.session.commit()
            return {"approved": True, "msg": "User added successfully"}, 200
        except IntegrityError as e:
            db.session.rollback()
            print("Whoops: ", e)
            return {
                "approved": False,
                "msg": "Error adding user. Username may already exist.",
            }, 500
