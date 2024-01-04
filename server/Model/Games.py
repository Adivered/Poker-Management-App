from application import db


class Games(db.Model):
    id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    game_id = db.Column(db.Integer, db.ForeignKey("game.id"))
    total_pot = db.Column(db.Integer, nullable=False, default=0)
    total_entries = db.Column(db.Integer, nullable=False, default=0)
    highest_winner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    highest_winner = db.relationship(
        "Users", foreign_keys=[highest_winner_id], back_populates="won_highest"
    )
    highest_loser_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    highest_loser = db.relationship(
        "Users", foreign_keys=[highest_loser_id], back_populates="lost_highest"
    )
