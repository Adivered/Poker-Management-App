# Users.py
from application import db
from werkzeug.security import check_password_hash, generate_password_hash


class Users(db.Model):
    """
    Class representing a user in the application.

    Attributes:
    - id (int): Primary key for the user, auto-incremented.
    - username (str): Unique username for the user.
    - password (str): Hashed password for the user.
    - first_name (str): First name of the user.
    - last_name (str): Last name of the user.
    - phone (str): Phone number of the user.
    - email (str): Unique email address of the user.
    - profile_picture (str): URL or path to the user's profile picture.
    - cash (int): Amount of cash the user possesses.
    - profit (int): Total profit earned by the user.
    - loss (int): Total loss incurred by the user.
    - status (int): User status (1 for active, 0 for inactive).

    Relationships:
    - games_created (relationship): Relationship with the Game model representing games created by the user.
    - games_played (relationship): Relationship with the Players model representing games played by the user.
    - won_highest (relationship): Relationship with the Games model representing games won with the highest score.
    - lost_highest (relationship): Relationship with the Games model representing games lost with the highest score.

    Methods:
    - __init__: Constructor to initialize a new user.
    - set_password: Method to set the password for the user.
    - check_password: Method to check if the provided password matches the user's hashed password.
    - user_exist: Class method to check if a user with a given username exists.
    - get_user_by_username: Class method to get a user by their username.
    - get_inactive_usernames: Class method to get usernames of inactive users.
    - get_active_usernames: Class method to get usernames of active users.
    - to_dict: Method to convert user details to a dictionary.

    """

    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    profile_picture = db.Column(db.String(200), nullable=True)
    cash = db.Column(db.Integer, nullable=False)
    profit = db.Column(db.Integer, nullable=False)
    loss = db.Column(db.Integer, nullable=False)
    status = db.Column(db.SmallInteger, nullable=False, default=1)
    games_created = db.relationship(
        "Game", back_populates="creator", foreign_keys="Game.created_by"
    )
    games_played = db.relationship("Players", back_populates="user")
    won_highest = db.relationship(
        "Games", foreign_keys="Games.highest_winner_id", back_populates="highest_winner"
    )
    lost_highest = db.relationship(
        "Games", foreign_keys="Games.highest_loser_id", back_populates="highest_loser"
    )

    def __init__(
        self,
        username: str,
        password: str,
        first_name: str,
        last_name: str,
        phone: str,
        email: str,
        profile_picture: str,
        cash: int,
        profit: int,
        loss: int,
        status: int,
    ):
        """
        Constructor to initialize a new user.

        Parameters:
        - username (str): Unique username for the user.
        - password (str): Password for the user.
        - first_name (str): First name of the user.
        - last_name (str): Last name of the user.
        - phone (str): Phone number of the user.
        - email (str): Email address of the user.
        - profile_picture (str): URL or path to the user's profile picture.
        - cash (int): Initial amount of cash for the user.
        - profit (int): Initial profit for the user.
        - loss (int): Initial loss for the user.
        - status (int): User status (1 for active, 0 for inactive).

        """
        self.username = username
        self.set_password(password)
        self.first_name = first_name
        self.last_name = last_name
        self.phone = phone
        self.email = email
        self.profile_picture = profile_picture
        self.cash = cash
        self.profit = profit
        self.loss = loss
        self.status = status

    def set_password(self, password: str) -> None:
        """
        Method to set the password for the user.

        Parameters:
        - password (str): Password to be set.

        Returns:
        None

        """
        self.password = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        """
        Method to check if the provided password matches the user's hashed password.

        Parameters:
        - password (str): Password to be checked.

        Returns:
        bool: True if the password matches, False otherwise.

        """
        return check_password_hash(self.password, password)

    @classmethod
    def user_exist(cls, username: str) -> bool:
        """
        Class method to check if a user with a given username exists.

        Parameters:
        - username (str): Username to check.

        Returns:
        bool: True if the user exists, False otherwise.

        """
        return cls.query.filter(cls.username == username).count() > 0

    @classmethod
    def get_user_by_username(cls, username: str) -> "Users":
        """
        Class method to get a user by their username.

        Parameters:
        - username (str): Username of the user.

        Returns:
        Users: User instance.

        """
        return cls.query.filter(cls.username == username).first()

    @classmethod
    def get_inactive_usernames(cls) -> set:
        """
        Class method to get usernames of inactive users.

        Returns:
        set: Set of usernames of inactive users.

        """
        inactive_users = cls.query.filter_by(status=0).all()
        return {user.username for user in inactive_users}

    @classmethod
    def get_active_usernames(cls) -> dict:
        """
        Class method to get usernames of active users.

        Returns:
        dict: Dictionary containing usernames of active users and their status.

        """
        active_users = cls.query.filter_by(status=1).all()
        return {user.username: user.status for user in active_users}

    def to_dict(self) -> dict:
        """
        Method to convert user details to a dictionary.

        Returns:
        dict: Dictionary containing user details.

        """
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "phone": self.phone,
            "email": self.email,
            "profile_picture": self.profile_picture,
            "cash": self.cash,
            "profit": self.profit,
            "loss": self.loss,
            "status": self.status,
            "games_created": [game.id for game in self.games_created],
            "games_played": [player.game_id for player in self.games_played],
            "won_highest": [game.id for game in self.won_highest],
            "lost_highest": [game.id for game in self.lost_highest],
        }
