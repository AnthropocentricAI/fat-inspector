"""Graph blueprint module for routes to modify graphs."""

import json
import os
from json.decoder import JSONDecodeError
from shutil import copyfile
from uuid import uuid4

from flask import current_app
from flask import jsonify
from flask import request
from flask import send_file
from flask.blueprints import Blueprint

from app import utilities as util
from app.exceptions import APIArgumentError
from app.functions import funcs

# all routes in here are accessible through '/graph/<route>'
bp = Blueprint('graph', __name__, url_prefix='/graph')


def verify_graph(graph: dict) -> bool:
    # uploaded graph must have nodes and links
    nodes = graph.get('nodes')
    links = graph.get('links')
    return isinstance(nodes, list) and isinstance(links,
                                                  list) and len(nodes) > 0


@bp.route('/<name>/save', methods=['POST'])
def save(name):
    if not request.is_json:
        raise APIArgumentError('Invalid request - must be of type JSON.')

    graph = request.json
    if not verify_graph(graph):
        raise APIArgumentError(
            f'Invalid graph provided!' +
            'Please provide a JSON object with \'nodes\' and \'links\' attributes.'
        )

    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'],
                                 name) + '.json'
        with open(file_path, 'w') as f:
            json.dump(graph, f)
            return jsonify({'message': f'Successfully saved {name}.'})
    except (JSONDecodeError, IOError) as e:
        # TODO: replace all of these with logging
        print(e)
        raise APIArgumentError(
            f'An error occurred while attempting to save graph {name}.')


@bp.route('/upload', methods=['POST'])
def upload():
    if 'graph_file' not in request.files or 'graph_name' not in request.form:
        raise APIArgumentError(
            'Invalid request arguments.\n\tgraph_file: <bytes>\n\tgraph_name: <str>'
        )

    file = request.files.get('graph_file')
    graph_bytes = file.read()
    name = util.normalise_path_to_file(
        request.form.get('graph_name')) + '.json'

    try:
        g = graph_bytes.decode('utf-8').replace('\'', '"')
        graph = json.loads(g)
        if not verify_graph(graph):
            raise APIArgumentError(
                f'{name} is not a valid graph! ' +
                'Please provide a .json file with \'nodes\' and \'links\' attributes.'
            )
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        with open(file_path, 'xb') as f:
            f.write(graph_bytes)
        return jsonify({
            'message':
            f'Successfully uploaded graph {file.filename} as {name}.'
        })
    except IOError as e:
        print(e)
        raise APIArgumentError(
            f'{name} already exists, or an error occurred while attempting to save the graph.'
        )


@bp.route('<name>/rename', methods=['POST'])
def rename(name):
    if 'new_name' not in request.form:
        raise APIArgumentError('Invalid request arguments.\n\tnew_name: <str>')

    old_name = util.normalise_path_to_file(name) + '.json'
    new_name = util.normalise_path_to_file(
        request.form.get('new_name')) + '.json'
    new_name = os.path.join(current_app.config['ASSETS_DIR'], new_name)

    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], old_name)
        os.rename(file_path, new_name)
        return jsonify(
            {'message': f'Successfully renamed {old_name} to {new_name}'})
    except IOError as e:
        print(e)
        raise APIArgumentError(
            f'{name} does not exist, or {new_name} already exists!')


@bp.route('/<name>/download')
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


@bp.route('/<name>/duplicate', methods=['POST'])
def duplicate(name):
    if 'new_name' not in request.form:
        raise APIArgumentError(
            f'Invalid request arguments.\n\tnew_name: <str>')

    old_name = util.normalise_path_to_file(name) + '.json'
    old_path = os.path.join(current_app.config['ASSETS_DIR'], old_name)
    new_name = util.normalise_path_to_file(
        request.form.get('new_name')) + '.json'
    new_path = os.path.join(current_app.config['ASSETS_DIR'], new_name)

    try:
        copyfile(old_path, new_path)
        return jsonify(
            {'message': f'Successfully duplicated {old_name} to {new_name}!'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'Graph {name} does not exist!')


@bp.route('/view')
def view_all():
    graphs = util.list_files_in_dir(current_app.config['ASSETS_DIR'], '.json',
                                    True)
    return jsonify(sorted(graphs))


@bp.route('/<name>/create')
def create(name):
    name = util.normalise_path_to_file(name) + '.json'
    file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
    exists = os.path.exists(file_path)

    newGraph = {'links': [], 'nodes': [{'id': str(uuid4()), 'label': 'root'}]}

    #{"links": [{"source": "32e1dca1-1d45-4857-81a7-78dc8ab46d6a", "target": "7dcab302-fe69-46c0-b2a6-3a68a4edcfcd"}, {"source": "7dcab302-fe69-46c0-b2a6-3a68a4edcfcd", "target": "fae7e67b-0c9b-4ded-a616-f0bca09ce1bc"}], "nodes": [{"id": "32e1dca1-1d45-4857-81a7-78dc8ab46d6a", "label": "Original Dataset"}, {"function": {"axis": 1, "indices": [1, 3], "name": "fatd.transform.data.median"}, "id": "7dcab302-fe69-46c0-b2a6-3a68a4edcfcd", "label": "Calculate Median"}, {"desc": "Fuck you", "function": {"axis": 1, "indices": [1, 2, 3], "name": "fatd.transform.data.threshold"}, "id": "fae7e67b-0c9b-4ded-a616-f0bca09ce1bc", "label": "Eat My Big Tasty Asshole"}]}

    if not exists:
        try:
            with open(file_path, 'w') as f:
                json.dump(newGraph, f)
                # return jsonify({'message': f'Successfully saved {name}.'})
                return jsonify({'message': f'Successfully saved {name}.'})
        except (JSONDecodeError, IOError) as e:
            # TODO: replace all of these with logging
            print(e)
            raise APIArgumentError(
                f'An error occurred while attempting to save graph {name}.')
    else:
        return jsonify({'message': f'{name} already exists as a graph.'})


@bp.route('/<name>/fetch')
def fetch(name):
    name = util.normalise_path_to_file(name) + '.json'
    file_path = os.path.join(current_app.config['ASSETS_DIR'], name)

    try:
        with open(file_path) as f:
            graph = json.load(f)
            return jsonify(graph)
    except IOError as e:
        print(e)
        raise APIArgumentError(f'Graph {name} does not exist!')


@bp.route('/<name>/createAndFetch')
def createAndFetch(name):
    create(name)

    return fetch(name)


@bp.route('/functions')
def fetch_functions():
    return jsonify(list(funcs.keys()))
