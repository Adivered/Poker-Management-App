# Players.py

from application import db


class Players(db.Model):
    """
    Class representing a player in the application.

    Attributes:
    - id (int): Primary key for the player, auto-incremented.
    - user_id (int): Foreign key referencing the Users model for the player's user.
    - game_id (int): Foreign key referencing the Game model for the player's game.
    - reentries (int): Number of reentries for the player in a game.
    - user (relationship): Relationship with the Users model representing the player's user.
    - game (relationship): Relationship with the Game model representing the player's game.

    Methods:
    - __init__: Constructor to initialize a new player.
    - player_exists: Class method to check if a player with a given user_id exists.
    - set_game: Class method to set the game for the Players class.
    - get_player: Class method to get a player by their user_id.
    - add_entry: Class method to add entries for a player.
    - to_dict: Method to convert player details to a dictionary.

    """

    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    game_id = db.Column(db.Integer, db.ForeignKey("game.id"))
    reentries = db.Column(db.Integer, nullable=False, default=0)
    user = db.relationship("Users", back_populates="games_played")
    game = db.relationship("Game", back_populates="players")

    def __init__(self, user, game, reentries=1):
        """
        Constructor to initialize a new player.

        Parameters:
        - user: User instance representing the player's user.
        - game: Game instance representing the player's game.
        - reentries (int): Number of reentries for the player.

        """
        self.user = user
        self.game = game
        self.reentries = reentries

    @classmethod
    def player_exists(cls, user_id: int) -> bool:
        """
        Class method to check if a player with a given user_id exists.

        Parameters:
        - user_id (int): ID of the user associated with the player.

        Returns:
        bool: True if the player exists, False otherwise.

        """
        return cls.query.filter(cls.user_id == user_id).count() > 0

    @classmethod
    def set_game(cls, game) -> None:
        """
        Class method to set the game for the Players class.

        Parameters:
        - game: Game instance to set for the Players class.

        Returns:
        None

        """
        cls.game = game

    @classmethod
    def get_player(cls, user_id: int) -> "Players":
        """
        Class method to get a player by their user_id.

        Parameters:
        - user_id (int): ID of the user associated with the player.

        Returns:
        Players: Player instance.

        """
        return cls.query.filter(cls.user_id == user_id).first()

    def get_user_id(self) -> int:
        """
        Method to get the user_id of the player.

        Returns:
        int: user_id of the player.

        """
        return self.user_id

    @classmethod
    def add_entry(cls, player_id: int, entries: int) -> None:
        """
        Class method to add entries for a player.

        Parameters:
        - player_id (int): ID of the player.
        - entries (int): Number of entries to add.

        Returns:
        None

        """
        player = cls.query.filter(cls.id == player_id).first()
        player.reentries = entries

    def to_dict(self) -> dict:
        """
        Method to convert player details to a dictionary.

        Returns:
        dict: Dictionary containing player details.

        """
        return {
            "id": self.id,
            "username": self.user.username,
            "entries": self.reentries,
            "profilePicture": self.user.profile_picture,
        }
