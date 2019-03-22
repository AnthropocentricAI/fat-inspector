"""Graph blueprint module for routes to modify graphs."""

import os

from flask import render_template, request, abort, jsonify, current_app
from flask.blueprints import Blueprint

from app.exceptions import APIArgumentError
from app import models
from app import utilities as util
from app import charts


bp = Blueprint('inspector', __name__, url_prefix='/inspector')


# setting -> { tab -> [ func ] }
@bp.route('/<name>/<tab>/chart')
def chart(name, tab):
    # settings = data/model/prediction
    # tab = fairness/accountability/transparency
    # get svgs for given setting/tab
    # 
    #return jsonify(sorted(list_datasets()))

    print('\ndsaddsa\n\n')

    name = util.normalise_path_to_file(name) + '.csv'
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        dataset = models.Dataset.from_path(file_path)
        # json data n message
        return charts.pieChart(dataset.data)
    except IOError as e:
        print(e)
        abort(400, 'Invalid dataset name.')

    return 0
