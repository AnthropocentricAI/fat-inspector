"""Graph blueprint module for routes to modify graphs."""

from app.tree import Tree
from shutil import copyfile
from flask import send_file, request, abort, jsonify, current_app
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


@bp.route('<name>/rename', methods=['POST'])
def rename(name):
    # TODO: normalise paths: currently the POST parameters are left unchecked
    if 'new_name' not in request.form:
        raise APIArgumentError('Invalid request arguments.\n\tnew_name: <str>')

    old_name = util.normalise_path_to_file(name) + '.json'
    new_name = request.form.get('new_name') + '.json'
    new_name = os.path.join(current_app.config['ASSETS_DIR'], new_name)

    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], old_name)
        os.rename(file_path, new_name)
        return jsonify({'message': f'Successfully renamed {old_name} to {new_name}'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'{name} does not exist, or {new_name} already exists!')


@bp.route('<name>/download')
def download(name):
    name = util.normalise_path_to_file(name) + '.json'
    file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
    try:
        return send_file(file_path,
                         as_attachment=True,
                         attachment_filename=name,
                         mimetype='text/json')
    except IOError as e:
        print(e)
        raise APIArgumentError(f'Graph {name} does not exist!')


@bp.route('<name>/duplicate', methods=['POST'])
def duplicate(name):
    if 'new_name' not in request.form:
        raise APIArgumentError(f'Invalid request arguments.\n\tnew_name: <str>')

    old_name = util.normalise_path_to_file(name) + '.json'
    old_path = os.path.join(current_app.config['ASSETS_DIR'], old_name)
    new_name = util.normalise_path_to_file(request.form.get('new_name')) + '.json'
    new_path = os.path.join(current_app.config['ASSETS_DIR'], new_name)

    try:
        copyfile(old_path, new_path)
        return jsonify({'message': f'Successfully duplicated {old_name} to {new_name}!'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'Graph {name} does not exist!')


# TODO: refactor lots of repetition between graph.py and dataset.py
def list_graphs():
    return [f[:-4] for f in os.listdir(current_app.config['ASSETS_DIR']) if f.endswith('.json')]


@bp.route('/view')
def view_all():
    return jsonify(sorted(list_graphs()))


@bp.route('/functions')
def fetch_functions():
    return jsonify(['TODO'])


@bp.route('/execute', methods=['POST'])
def execute():
    abort(500, 'Not implemented yet!')
