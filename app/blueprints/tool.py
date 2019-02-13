"""Tool blueprint module for routes for the 'main' part of the app."""
from flask import render_template, request, abort
from flask.blueprints import Blueprint


bp = Blueprint('tool', __name__)


@bp.route('/')
def index():
    return 'yes!'
