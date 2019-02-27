"""Tool blueprint module for routes for the 'main' part of the app."""
from flask import render_template, request, abort
from flask.blueprints import Blueprint


bp = Blueprint('tool', __name__)


@bp.route('/')
def index():
<<<<<<< HEAD
    return 'yes!'

@bp.route('/react')
def react():
    return render_template('index.html')
=======
    return render_template('index.html')
>>>>>>> 0648753d12a3ba6ab14ab76d7ed50c32dd59f16b
