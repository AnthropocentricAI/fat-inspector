"""Entrypoint module for fat-inspector.

Run this with `flask run`; flask will auto-detect and run the create_app function.
"""
from app.config import config
from flask import Flask
import os
import importlib


def load_blueprints(app):
    """Load the blueprints for the application from the './blueprints' folder.

    :param app: current application
    """
    for file in os.listdir(os.path.join(os.path.dirname(__file__), 'blueprints')):
        # if it's a python file (excluding '__init__.py') then import its blueprint
        if file.endswith('.py') and file != '__init__.py':
            route = importlib.import_module('app.blueprints.' + file[:-3])
            app.register_blueprint(route.bp)


def create_app():
    app = Flask(__name__)
    app.config.from_object(config.get(os.getenv('FLASK_CONFIG') or 'default'))
    # register db
    from app.models import db
    db.init_app(app)

    load_blueprints(app)

    return app