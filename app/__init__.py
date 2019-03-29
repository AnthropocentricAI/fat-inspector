"""Entrypoint module for fat-inspector.

Run this with `flask run`; flask will auto-detect and run the create_app function.
"""
import importlib
import os

from flask import Flask
from flask import jsonify

from app import exceptions
from app.config import config


def load_blueprints(app):
    """Load the blueprints for the application from the './blueprints' folder.

    :param app: current application
    """
    for file in os.listdir(os.path.join(os.path.dirname(__file__), 'blueprints')):
        # if it's a python file (excluding '__init__.py' and 'main.py') then import its blueprint
        if file.endswith('.py') and file != '__init__.py' and file != 'main.py':
            route = importlib.import_module('app.blueprints.' + file[:-3])
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
