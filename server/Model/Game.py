# Game.py

from application import db
from datetime import datetime
from Model.Users import Users
from Model.Players import Players


class Game(db.Model):
    """
    Class representing a game in the application.

    Attributes:
    - id (int): Primary key for the game, auto-incremented.
    - game_active (bool): Flag indicating whether the game is active.
    - price_per_entry (int): Default price per entry for the game.
    - entries (int): Number of entries in the game.
    - pot (int): Total pot amount in the game.
    - location (str): Location information for the game.
    - created_at (datetime): Timestamp indicating when the game was created.
    - created_by (int): Foreign key referencing the user who created the game.
    - creator (relationship): Relationship with the Users model representing the creator of the game.
    - players (relationship): Relationship with the Players model representing players in the game.

    Methods:
    - __init__: Constructor to initialize a new game.
    - set_price_per_entry: Class method to set the default price per entry.
    - get_default_price_per_entry: Class method to get the default price per entry.
    - get_entries: Class method to get the total number of entries.
    - update_entries: Method to update the total number of entries in the game.
    - add_entry_to_player: Method to add entries to a specific player in the game.
    - add_player: Method to add a player to the game.
    - add_players: Method to add multiple players to the game.
    - update_pot: Method to update the total pot amount in the game.
    - get_pot: Class method to get the total pot amount.
    - get_game: Class method to get a specific game by its ID.
    - remove_player: Method to remove a player from the game.
    - is_player_playing: Class method to check if a player is playing in any game.
    - to_dict: Method to convert the game details to a dictionary.

    """

    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    game_active = db.Column(db.Boolean, nullable=False, default=False)
    price_per_entry = db.Column(db.Integer, nullable=False, default=50)
    entries = db.Column(db.Integer, nullable=False, default=0)
    pot = db.Column(db.Integer, nullable=False, default=0)
    location = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    creator = db.relationship("Users", back_populates="games_created")
    players = db.relationship("Players", back_populates="game")

    def __init__(
        self, game_active, created_by, price_per_entry, players, location=None
    ):
        """
        Constructor to initialize a new game.

        Parameters:
        - game_active (bool): Flag indicating whether the game is active.
        - created_by (int): ID of the user who created the game.
        - price_per_entry (int): Default price per entry for the game.
        - players (list): List of players to be added to the game.
        - location (str, optional): Location information for the game (default is None).

        """
        self.game_active = game_active
        self.created_by = created_by
        self.location = location
        self.price_per_entry = price_per_entry
        self.entries = 0
        self.pot = 0
        self.players = []
        if players:
            self.add_players(players)
        self.created_at = datetime.utcnow()

    @classmethod
    def set_price_per_entry(cls, new_price: int) -> None:
        """
        Class method to set the default price per entry.

        Parameters:
        - new_price (int): New default price per entry.

        Returns:
        None

        """
        cls.price_per_entry = new_price
        db.session.commit()

    @classmethod
    def get_default_price_per_entry(cls) -> int:
        """
        Class method to get the default price per entry.

        Returns:
        int: Default price per entry.

        """
        return cls.price_per_entry

    @classmethod
    def get_entries(cls) -> int:
        """
        Class method to get the total number of entries.

        Returns:
        int: Total number of entries.

        """
        return cls.entries

    def update_entries(self) -> None:
        """
        Method to update the total number of entries in the game.

        Returns:
        None

        """
        self.entries = sum(player.reentries for player in self.players)
        db.session.commit()

    def add_entry_to_player(self, player_id: int, entries: int) -> None:
        """
        Method to add entries to a specific player in the game.

        Parameters:
        - player_id (int): ID of the player.
        - entries (int): Number of entries to add.

        Returns:
        None

        """
        if any(player.id == player_id for player in self.players):
            Players.add_entry(player_id, entries)
            self.update_entries()
            self.update_pot(self.price_per_entry)
            db.session.commit()

    def add_player(self, player: str) -> None:
        """
        Method to add a player to the game.

        Parameters:
        - player (str): Username of the player.

        Returns:
        None

        """
        user = Users.query.filter_by(username=player).first()
        if user and user not in self.players:
            if Players.player_exists(player):
                player = Players.get_player(user)
                player.set_game(self)
            else:
                player = Players(user=user, game=self)
            self.players.append(player)
            user.status = 1
            db.session.add(player)
            db.session.commit()

    def add_players(self, players: list) -> None:
        """
        Method to add multiple players to the game.

        Parameters:
        - players (list): List of usernames of players to add.

        Returns:
        None

        """

        for username in players:
            self.add_player(username)
        self.update_entries()
        self.update_pot(self.price_per_entry * len(players))
        db.session.commit()

    def update_pot(self, cash: int) -> None:
        """
        Method to update the total pot amount in the game.

        Parameters:
        - cash (int): Amount of cash to update the pot.

        Returns:
        None

        """
        self.pot += cash
        db.session.commit()

    @classmethod
    def get_pot(cls) -> int:
        """
        Class method to get the total pot amount.

        Returns:
        int: Total pot amount.

        """
        return cls.pot

    @classmethod
    def get_game(cls, game_id: int) -> "Game":
        """
        Class method to get a specific game by its ID.

        Parameters:
        - game_id (int): ID of the game.

        Returns:
        Game: Game instance.

        """
        return cls.query.filter(cls.id == game_id).first()

    def remove_player(self, player_id: int) -> None:
        """
        Method to remove a player from the game.

        Parameters:
        - player_id (int): ID of the player to be removed.

        Returns:
        None

        """
        player_to_remove = next(
            (player for player in self.players if player.id == player_id), None
        )

        if player_to_remove:
            user_to_remove = player_to_remove.user
            user_to_remove.status = 0
            entries_removed = player_to_remove.reentries
            self.players.remove(player_to_remove)
            db.session.delete(player_to_remove)
            self.update_entries()
            self.update_pot(-entries_removed * self.price_per_entry)
            db.session.commit()

    @classmethod
    def is_player_playing(cls, player: str) -> bool:
        """
        Class method to check if a player is playing in any game.

        Parameters:
        - player (str): Username of the player.

        Returns:
        bool: True if the player is playing; False otherwise.

        """
        return player in cls.players

    def to_dict(self) -> dict:
        """
        Method to convert the game details to a dictionary.

        Returns:
        dict: Dictionary containing game details.

        """
        return {
            "game_id": self.id,
            "game_active": self.game_active,
            "price_per_entry": self.price_per_entry,
            "entries": self.entries,
            "pot": self.pot,
            "location": self.location,
            "created_at": self.created_at,
            "created_by": self.created_by,
            "players": [player.to_dict() for player in self.players],
        }
