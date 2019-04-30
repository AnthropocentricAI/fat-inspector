import json
import os


import dill as pickle


from fatd.holders import csv_loader
from flask import current_app
from flask import jsonify
from flask.blueprints import Blueprint


from app.exceptions import APIArgumentError
from app.exceptions import TreeComputationError
from app.tree import load_tree


from fatd.holders.transitions import Data2Model, Model2Predictions
from fatd.holders.models import KNN
from fatd.transform.tools.training import train_test_split


bp = Blueprint('model', __name__, url_prefix='/model')


@bp.route('/<dataset>/<graph>/<node>/save', methods=['POST'])
def save_model(dataset, graph, node):
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

# returns model, data_2_model
# TODO: some sort of error lol
def load_model_pickles(dataset, graph, node):
    """ to_load = { f'{node}_model': None, f'{node}_data_2_model': None }

    for p in to_load.keys():
        path = os.path.join(current_app.config['ASSETS_DIR'], 'pickles', p)
        to_load[p] = pickle.load(open(path, 'rb')) """

    paths = [ f'{node}_model', f'{node}_data_2_model' ]
    model, data_2_model = None, None
    for p in paths:
        path = os.path.join(current_app.config['ASSETS_DIR'], 'pickles', p, '.pickle')

        if p.endswith('data_2_model'): data_2_model = pickle.load(open(path, 'rb'))
        if p.endswith('model'): model = pickle.load(open(path, 'rb'))
    
    return model, data_2_model