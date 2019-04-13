import os
import json

from flask import current_app
from flask import jsonify
from flask.blueprints import Blueprint

from app.exceptions import APIArgumentError
from app.exceptions import TreeComputationError
from app.tree import build_tree
from app.tree import save_tree
from fatd.holders import csv_loader


bp = Blueprint('execute', __name__, url_prefix='/execute')


@bp.errorhandler(TreeComputationError)
def handle_tree_error(err: TreeComputationError):
    response = err.to_dict()
    response.status_code = 400
    return response


@bp.route('/<dataset>/<graph>', methods=['POST'])
def execute(dataset, graph):
    path = os.path.join(current_app.config['ASSETS_DIR'], dataset) + '.csv'
    try:
        with open(os.path.join(current_app.config['ASSETS_DIR'], graph + '.json')) as f:
            graph_json = json.load(f)
        dataset_csv = csv_loader(path)

        tree = build_tree(dataset_csv, graph_json)
        tree.compute()
        name = f'{dataset}_{graph}_tree.pickle'
        pickle_path = os.path.join(current_app.config['ASSETS_DIR'], 'pickles', name)
        save_tree(tree, pickle_path)
        return jsonify({'message': f'Executed {graph} with {dataset} successfully.'})
    except Exception as e:
        # TODO: make except clause more specific
        print(e)
        raise APIArgumentError(f'Failed to execute {graph} with {dataset}. Perhaps the dataset does not exist?')
