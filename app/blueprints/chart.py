"""Graph blueprint module for routes to modify graphs."""

import os

from flask import render_template, request, abort, jsonify, current_app
from flask.blueprints import Blueprint

from app.exceptions import APIArgumentError
from app import models
from app import utilities as util
from app import charts


bp = Blueprint('chart', __name__, url_prefix='/chart')

# (d/m/p, f/a/t) -> [ (title, func) ]
all_charts = {
    ('data', 'accountability'): [('Class Count', [], charts.pieChart)],
    ('data', 'fairness'): [('Histogram', ['col'], charts.histogram)]
}


@bp.route('/<name>/<mode>/<tab>/chart')
def chart_svgs(name, mode, tab):
    # mode = data/model/prediction
    # tab = fairness/accountability/transparency
    # get svgs for given setting/tab

    # get list of graphs
    combo = (mode, tab)
    graphs = []
    if combo in all_charts:
        graphs = all_charts[combo]
    else:
        abort(400, 'No such mode & tab combination')

    name = util.normalise_path_to_file(name) + '.csv'
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        dataset = models.Dataset.from_path(file_path)
        # json data n message
        print('\n\n',graphs,'\n\n')
        svg = graphs[0][1](dataset.data)
        js = jsonify({ 'data': str(svg), 'msg': graphs[0][0] })
        print(js.data)
        return js
    except IOError as e:
        print(e)
        abort(400, 'Invalid dataset name.')

    return 0

# returns [(str, args)]
# for a given mode & tab
@bp.route('/<mode>/<tab>')
def all_chart_types(mode, tab):
    combo = (mode, tab)
    if combo in all_charts:
        # remove function from tuple
        ret = [ x[:2] for x in all_charts.get(combo) ]
        return jsonify(ret)
    else:
        abort(400, 'Invalid mode & tab combination.')

# also takes a query string of args
# returns (str, args, svg)
# for a given dataset, mode, tab, & type of chart
@bp.route('/<name>/<mode>/<tab>/<type>/chart')
def chart(name, mode, tab, type):
    pass