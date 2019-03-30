"""Graph blueprint module for routes to modify graphs."""

from app.tree import Tree
from flask import render_template, request, abort, jsonify, current_app
from flask.blueprints import Blueprint


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
    return jsonify(['TODO'])


@bp.route('/execute', methods=['POST'])
def execute():
    if not request.is_json:
        abort(400, 'Request should be JSON.')
