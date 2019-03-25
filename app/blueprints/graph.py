"""Graph blueprint module for routes to modify graphs."""

from app.tree import Tree
from flask import render_template, request, abort, jsonify, current_app
from flask.blueprints import Blueprint
from app.exceptions import APIArgumentError
from app import utilities as util
import os

# all routes in here are accessible through '/graph/<route>'
bp = Blueprint('graph', __name__, url_prefix='/graph')


# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    if 'graph_file' not in request.files or 'graph_name' not in request.form:
        raise APIArgumentError('Invalid request arguments.\n\tgraph_file: <bytes>\n\tgraph_name: <str>')

    file = request.files.get('graph_file')
    graph_bytes = file.read()
    name = util.normalise_path_to_file(request.form.get('graph_name')) + '.json'

    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        with open(file_path, 'xb') as f:
            f.write(graph_bytes)
        return jsonify({'message': f'Successfully uploaded graph {file.filename} as {name}.'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'{name} already exists, or an error occurred while attempting to save the graph.')


@bp.route('/rename', methods=['POST'])
def rename():
    abort(500, 'Not implemented yet!')


@bp.route('/download')
def download():
    abort(500, 'Not implemented yet!')


@bp.route('/functions')
def fetch_functions():
    return jsonify(['TODO'])


@bp.route('/execute', methods=['POST'])
def execute():
    if not request.is_json:
        abort(500, 'Request should be JSON.')
