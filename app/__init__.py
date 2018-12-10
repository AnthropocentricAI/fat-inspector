import os
from app.config import config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
db = SQLAlchemy()

def create_app(cfg):
    app.config.from_object(config.get(cfg))
    db.init_app(app)
    return app