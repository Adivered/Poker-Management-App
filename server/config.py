from os import environ
import datetime


class Config(object):
    SECRET_KEY = environ.get("SECRET_KEY")
    JWT_SECRET_KEY = environ.get("SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = environ.get("SQLALCHEMY_DATABASE_URI")
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=15)
    JWT_COOKIE_CSRF_PROTECT = True


class DevConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    DEBUG = True


class ProdConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False
    TESTING = False
    FLASK_ENV = "production"


class TestConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    DEBUG = True
    TESTING = True
    FLASK_APP = "application.py"
    FLASK_ENV = environ.get("FLASK_ENV")
    FLASK_RUN_PORT = 5007


class StageConfig(Config):
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False
    TESTING = False
    FLASK_APP = "application.py"
    FLASK_ENV = environ.get("FLASK_ENV")
    FLASK_RUN_PORT = 5009
