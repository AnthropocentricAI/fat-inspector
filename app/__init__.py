"""Entrypoint module for fat-inspector.

Run this with `flask run`; flask will auto-detect and run the create_app function.
"""
import importlib
import os

from flask import Flask
from flask import jsonify

from app import exceptions
from app.config import config
from app.utilities import list_files_in_dir


def load_blueprints(app):
    """Load the blueprints for the application from the './blueprints' folder.

    :param app: current application
    """
    blueprints = list_files_in_dir(os.path.join(os.path.dirname(__file__), 'blueprints'), '.py', True)
    for f in blueprints:
        if f != '__init__' and f != 'main':
            route = importlib.import_module(f'app.blueprints.{f}')
            app.register_blueprint(route.bp)
    # main.py MUST be imported last - the catch-all route takes the lowest precedence
    route = importlib.import_module('app.blueprints.main')
    app.register_blueprint(route.bp)


def create_app():
    app = Flask(__name__)
    app.config.from_object(config.get(os.getenv('FLASK_CONFIG') or 'default'))

    load_blueprints(app)

    @app.errorhandler(exceptions.APIArgumentError)
    def handle_api_error(err: exceptions.APIArgumentError):
        response = jsonify(err.to_dict())
        response.status_code = err.status_code
        return response

    try:
        os.mkdir(app.config['ASSETS_DIR'])
    except OSError:
        pass

    return app
