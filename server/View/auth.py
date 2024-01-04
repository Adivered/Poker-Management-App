from flask import jsonify, request
from application import app, jwt, socketio
import json, re
from Model.Users import Users
from Model.Players import Players
from Model.Game import Game


from flask_jwt_extended import (
    create_access_token,
    unset_jwt_cookies,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)


@jwt.user_lookup_loader
def id_from_token(_jwt_header: dict, jwt_data: dict) -> int:
    """
    Looks up user id from JWT token.

    Parameters:
    - _jwt_header (dict): JWT header (not used)
    - jwt_data (dict): Decoded JWT data

    Returns:
    - int: User ID or None if not found
    """
    try:
        identity = jwt_data["sub"]
        user = Users.query.filter_by(id=identity).first()
        if user:
            user_id = user.id
            return user_id
    except Exception as e:
        print(f"Error in id_from_token: {str(e)}")
    return None


@app.route("/refresh_token", methods=["POST"])
@jwt_required(refresh=True)
def refresh_token() -> jsonify:
    """
    Refreshes the access token.

    Returns:
    - JSON: New access token
    """
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200


@app.route("/refresh_token_user", methods=["POST"])
@jwt_required(refresh=True)
def refresh_user_token() -> jsonify:
    """
    Refreshes the user's access and refresh tokens.

    Returns:
    - JSON: User data with new tokens
    """
    try:
        current_user_id = get_jwt_identity()
        current_user = Users.query.get(current_user_id)

        access_token = create_access_token(identity=current_user.id)
        refresh_token = create_refresh_token(identity=current_user.id)
        token_life_span = int(app.config["JWT_ACCESS_TOKEN_EXPIRES"].seconds) * 500

        response_data = {
            "id": current_user.id,
            "username": current_user.username,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name,
            "phone": current_user.phone,
            "email": current_user.email,
            "profile_picture": current_user.profile_picture,
            "cash": current_user.cash,
            "profit": current_user.profit,
            "loss": current_user.loss,
            "status": current_user.status,
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_life_span": token_life_span,
            "refresh_timeout": 10000,
        }

        if current_user.status == 1:
            latest_player_record = (
                Players.query.filter_by(user_id=current_user.id)
                .order_by(Players.id.desc())
                .first()
            )
            if latest_player_record:
                latest_game_id = latest_player_record.game_id
                game = Game.get_game(latest_game_id)
                latest_game_data = game.to_dict()
                inactive_usernames = Users.get_inactive_usernames()
                inactive_users = [
                    {
                        "username": username,
                        "id": Users.get_user_by_username(username).id,
                    }
                    for username in inactive_usernames
                ]
                latest_game_data["availablePlayers"] = inactive_users
                response_data["activeGame"] = latest_game_data

        return jsonify(response_data), 200
    except Exception as e:
        print(f"Error in refresh_user_token: {str(e)}")
        return jsonify({"msg": "Internal Server Error"}), 500


@app.route("/get_token", methods=["POST"])
def get_token() -> jsonify:
    """
    Retrieves the access token for a user.

    Returns:
    - JSON: User data with access token
    """
    username = request.json.get("username")
    password = request.json.get("password")
    if Users.user_exist(username):
        user_in_db = Users.get_user_by_username(username)
        if user_in_db and user_in_db.check_password(password):
            access_token = create_access_token(identity=user_in_db.id, fresh=True)
            refresh_token = create_refresh_token(identity=user_in_db.id)
            token_life_span = int(app.config["JWT_ACCESS_TOKEN_EXPIRES"].seconds) * 500
            response_data = {
                "id": user_in_db.id,
                "username": user_in_db.username,
                "first_name": user_in_db.first_name,
                "last_name": user_in_db.last_name,
                "phone": user_in_db.phone,
                "email": user_in_db.email,
                "profile_picture": user_in_db.profile_picture,
                "cash": user_in_db.cash,
                "profit": user_in_db.profit,
                "loss": user_in_db.loss,
                "status": user_in_db.status,
                "access_token": access_token,
                "refresh_token": refresh_token,
                "token_life_span": token_life_span,
                "refresh_timeout": 10000,
            }

            if user_in_db.status == 1:
                latest_player_record = (
                    Players.query.filter_by(user_id=user_in_db.id)
                    .order_by(Players.id.desc())
                    .first()
                )
                if latest_player_record:
                    latest_game_id = latest_player_record.game_id
                    latest_game_data = Game.get_game(latest_game_id).to_dict()
                    response_data["activeGame"] = latest_game_data

            return jsonify(response_data), 200
        else:
            return {"msg": "Wrong Username or Password!"}, 401
    else:
        return {"msg": "Wrong Username or Password!"}, 401


@app.route("/logout", methods=["POST"])
@jwt_required(refresh=True)
def logout_with_token() -> jsonify:
    """
    Logs out a user by invalidating the refresh token.

    Returns:
    - JSON: Logout success message
    """
    response_json = jsonify({"msg": "Logout succeeded"})
    unset_jwt_cookies(response_json)
    return response_json
