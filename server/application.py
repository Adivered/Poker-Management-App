from flask import Flask, render_template
from flask_socketio import SocketIO
import logging
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from config import DevConfig, ProdConfig

load_dotenv()

app = Flask(__name__)
CORS(app)
app.url_map.strict_slashes = False
tmp_env = os.getenv("FLASK_ENV")

if tmp_env == "production":
    app.config.from_object(ProdConfig)
elif tmp_env == "development":
    app.config.from_object(DevConfig)

db = SQLAlchemy(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")
app.logger.setLevel(logging.DEBUG)

from View import users, auth, main, games, game, player, socket
