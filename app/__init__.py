"""Entrypoint module for fat-inspector.

Run this with `flask run`; flask will auto-detect and run the create_app function.
"""


from app.config import config
from flask import Flask


# TODO: make config more dynamic (i.e. you can pick from env)
def create_app(cfg='development'):
    app = Flask(__name__)
    app.config.from_object(config.get(cfg))

    # register db
    from app.models import db
    db.init_app(app)

    # register blueprint routes
    from app import dataset, graph
    app.register_blueprint(dataset.bp)
    app.register_blueprint(graph.bp)

    return app