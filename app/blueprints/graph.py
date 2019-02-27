"""Graph blueprint module for routes to modify graphs."""

from flask import render_template, request, abort, jsonify
from flask.blueprints import Blueprint
import fatd.transform.data.columns

funcs = {f.__name__: f for _, f in fatd.transform.data.columns.__dict__.items() if callable(f)}

# all routes in here are accessible through '/graph/<route>'
bp = Blueprint('graph', __name__, url_prefix='/graph')


# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    abort(400, 'Not implemented yet!')


@bp.route('/rename', methods=['POST'])
def rename():
    abort(400, 'Not implemented yet!')


@bp.route('/download')
def download():
    abort(400, 'Not implemented yet!')


@bp.route('/functions')
def fetch_functions():
    return jsonify({'functions': list(funcs.keys())})


@bp.route('/execute')
def execute():
    if not request.is_json():
        abort(400, 'Request should be JSON.')
    data = request.json
