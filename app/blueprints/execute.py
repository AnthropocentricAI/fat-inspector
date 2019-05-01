import json
import os

import dill as pickle

from fatd.holders import csv_loader
from fatd.holders.transitions import Data2Model, Model2Predictions
from fatd.holders.models import KNN
from fatd.transform.tools.training import train_test_split

from flask import current_app
from flask import jsonify
from flask.blueprints import Blueprint

from app.exceptions import APIArgumentError
from app.exceptions import TreeComputationError
from app.tree import build_tree, save_tree, load_tree

bp = Blueprint('execute', __name__, url_prefix='/execute')


@bp.errorhandler(TreeComputationError)
def handle_tree_error(err: TreeComputationError):
    response = jsonify(err.to_dict())
    response.status_code = 400
    return response


@bp.route('/<dataset>/<graph>/data', methods=['POST'])
def execute_data(dataset, graph):
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
    except IOError as e:
        # TODO: make except clause more specific
        print(e)
        raise APIArgumentError(f'Failed to execute {graph} with {dataset}. Perhaps the dataset does not exist?')


@bp.route('/<dataset>/<graph>/<node>/model', methods=['POST'])
def execute_model(dataset, graph, node):
    # load dataset from node
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], 'pickles', f'{dataset}_{graph}_tree.pickle')
        t = load_tree(file_path)
        dataset = t.node_of(node).data

        # create data2model and model
        data_2_model = Data2Model(splitting_function=train_test_split)
        model = data_2_model.transform(dataset, KNN())

        # pickle data2model and model
        d = { f'{node}_model': model,
              f'{node}_data_2_model': data_2_model }
        for k, v in d.items():
            path = os.path.join(current_app.config['ASSETS_DIR'], 'pickles', k)
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(path + '.pickle', 'wb') as f:
                pickle.dump(v, f)
        
        return jsonify({'message': f'Saved model for {node} in {graph} successfully.'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'{dataset} is an invalid dataset name!')