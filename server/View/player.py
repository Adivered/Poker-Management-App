# player.py

from Model.Players import Players
from Model.Game import Game
from sqlalchemy.orm.attributes import InstrumentedAttribute
from application import app, db, socketio
from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_current_user


@app.route("/add_entry_to_player", methods=["POST"])
@jwt_required()
def add_entry_to_player():
    """
    Route to add entries to a player in a game.

    Endpoint: /add_entry_to_player
    Method: POST

    Parameters (JSON):
    - player_id (int): ID of the player.
    - game_id (int): ID of the game.
    - entries (int): Number of entries to add to the player.

    Returns:
    - JSON response containing:
      - pot (int): Updated pot value in the game.
      - entries (int): Updated total entries in the game.
      - newPlayerEntries (int): Number of entries added to the player.

    """
    try:
        player_id = request.json.get("player")
        game_id = request.json.get("game_id")
        entries = request.json.get("entries")
        game = Game.get_game(game_id)
        game.add_entry_to_player(player_id, entries)
        db.session.add(game)
        socketio.emit(
            "entry_updated",
            {
                "players": [player.to_dict() for player in game.players],
                "pot": int(game.pot),
                "entries": int(game.entries),
            },
        )

        return (
            jsonify(
                {
                    "pot": game.pot,
                    "entries": game.entries,
                    "newPlayerEntries": int(entries),
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Exception: {e}")
        return jsonify({"error": str(e)}), 500
