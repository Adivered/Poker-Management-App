# game.py

from Model.Game import Game
from sqlalchemy.orm.attributes import InstrumentedAttribute
from application import app, db, socketio
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_current_user
from Model.Users import Users
from Model.Players import Players
from flask_socketio import join_room, leave_room
from sqlalchemy import func


def get_inactive_users() -> list:
    """
    Retrieve a list of inactive users.

    Returns:
    list: List of dictionaries containing 'username' and 'id' of inactive users, ordered alphabetically.
    """

    # Assuming Users is your SQLAlchemy model for users
    inactive_users = (
        Users.query.filter(Users.username.in_(Users.get_inactive_usernames()))
        .order_by(func.lower(Users.username))
        .all()
    )

    # Create a list of dictionaries for inactive users
    result = [{"username": user.username, "id": user.id} for user in inactive_users]
    return result


@app.route("/get_initial_game_data", methods=["GET"])
@jwt_required()
def get_initial_game_data() -> jsonify:
    """
    Retrieve initial game data including default price per entry and available inactive players.

    Returns:
    jsonify: JSON response containing initial game data.
    """
    try:
        price_per_entry = Game.get_default_price_per_entry()
        if isinstance(price_per_entry, InstrumentedAttribute):
            price_per_entry = price_per_entry.property.columns[0].default.arg
        return (
            jsonify(
                {
                    "defaultPricePerEntry": price_per_entry,
                    "availablePlayers": get_inactive_users(),
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/create_game", methods=["POST"])
@jwt_required()
def create_game() -> jsonify:
    """
    Create a new game.

    Returns:
    jsonify: JSON response containing details of the created game.
    """
    try:
        # Extracting data from the request
        game_active = request.json.get("game_active")
        created_by = request.json.get("created_by")
        location = request.json.get("location")
        price_per_entry = request.json.get("price_per_entry")
        players = request.json.get("players")
        players_to_add = [player["username"] for player in players]

        # Creating a new game instance
        new_game = Game(
            game_active, created_by, price_per_entry, players_to_add, location
        )
        db.session.add(new_game)
        db.session.commit()
        players = [player.to_dict() for player in new_game.players]
        socketio.emit(
            "players_added",
            {"gameid": new_game.id, "playersAdded": players},
        )

        print("Players added: ", players)

        return (
            jsonify(
                {
                    "gameid": new_game.id,
                    "pot": new_game.pot,
                    "entries": new_game.entries,
                    "players": players,
                    "availablePlayers": get_inactive_users(),
                    "createdBy": new_game.created_by,
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/add_players_to_game", methods=["POST"])
@jwt_required()
def add_players_to_game() -> jsonify:
    """
    Add players to an existing game.

    Returns:
    jsonify: JSON response containing updated game details.
    """
    try:
        # Extracting data from the request
        players = request.json.get("players")
        game_id = request.json.get("game_id")
        players_to_add = [player["username"] for player in players]

        # Retrieving and updating the game
        game = Game.get_game(game_id)
        game.add_players(players_to_add)
        players = [player.to_dict() for player in game.players]
        db.session.add(game)
        socketio.emit(
            "players_added",
            {
                "gameid": game.id,
                "players": players,
                "playersAdded": players_to_add,
                "pot": int(game.pot),
                "entries": int(game.entries),
            },
        )
        print("Added users: ", players)

        return (
            jsonify(
                {
                    "players": players,
                    "pot": game.pot,
                    "entries": game.entries,
                    "availablePlayers": get_inactive_users(),
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/remove_player_from_game", methods=["POST"])
@jwt_required()
def remove_player_from_game() -> jsonify:
    """
    Remove a player from an existing game.

    Returns:
    jsonify: JSON response containing updated game details.
    """
    try:
        # Extracting data from the request
        player_id = request.json.get("player")
        game_id = request.json.get("game_id")
        # Retrieving and updating the game
        game = Game.get_game(game_id)
        print("Game id: ", game_id)
        print("Player id: ", player_id)

        player = Players.query.get(player_id)
        print("Player: ", player)

        user_id = player.get_user_id()
        game.remove_player(player_id)
        db.session.add(game)

        # Emit Socket.IO event for player removed with updated pot and entries
        socketio.emit(
            "player_removed",
            {
                "gameid": game.id,
                "players": [player.to_dict() for player in game.players],
                "pot": int(game.pot),
                "entries": int(game.entries),
                "playerRemoved": user_id,
            },
        )

        return (
            jsonify(
                {
                    "pot": game.pot,
                    "entries": game.entries,
                    "availablePlayers": get_inactive_users(),
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/get_game_data", methods=["GET"])
@jwt_required()
def get_game_data() -> jsonify:
    """
    Retrieve initial game data including default price per entry and available inactive players.

    Returns:
    jsonify: JSON response containing initial game data.
    """
    try:
        user_id = request.json.get("player")
        player = (
            Players.query.filter_by(user_id=user_id).order_by(Players.id.desc()).first()
        )
        latest_game_id = player.game_id
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
        return jsonify(latest_game_data), 200

    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500
