import os
from app.config import config
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sassutils.wsgi import SassMiddleware

app = Flask(__name__)
app.wsgi_app = SassMiddleware(app.wsgi_app, {
    'app': ('static/sass', 'static/css', 'static/css')
})

db = SQLAlchemy()

def create_app(cfg):
    app.config.from_object(config.get(cfg))
    db.init_app(app)
    
    return app