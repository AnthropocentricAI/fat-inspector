"""Main blueprint module for routes for the 'main' part of the app."""
from flask import render_template, redirect
from flask.blueprints import Blueprint


bp = Blueprint('main', __name__)


# this is a catch all route - any invalid route is redirected to the index
# the frontend handles the rest
@bp.route('/')
@bp.route('/<_>')
def catch_all(_=None):
    return render_template('index.html')
