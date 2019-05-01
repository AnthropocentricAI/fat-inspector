"""Graph blueprint module for routes to modify graphs."""

import os

from flask import render_template, request, abort, jsonify, current_app
from flask.blueprints import Blueprint

from app.exceptions import APIArgumentError
from app import utilities as util
from app import charts
from app.tree import load_tree
from app.blueprints.model import load_model_pickles

from fatd.holders import csv_loader
from fatd.holders.transitions import Data2Model, Model2Predictions
from fatd.holders.models import KNN
from fatd.transform.tools.training import train_test_split

bp = Blueprint('chart', __name__, url_prefix='/chart')


# (d/m/p, f/a/t) -> { type -> (title, args, (func :: dataset -> args -> string -> svg)) }
all_charts = {
    ('data', 'fairness'): {
        'histogram': {'id': 'histogram', 'title': 'Histogram', 'args': ['col'], 'args_default': [0], 'func': charts.histogram}
    },
    ('data', 'accountability'): {
        'class_count': {'id': 'class_count', 'title': 'Class Count', 'args': [], 'args_default': [], 'func': charts.pieChart}
    },
    ('model', 'fairness'): {
        'train_accuracy': {'id': 'train_accuracy', 'title': 'Train Accuracy', 'args': [], 'args_default': [], 'func': charts.train_accuracy},
        'data_accuracy': {'id': 'data_accuracy', 'title': 'Data Accuracy', 'args': [], 'args_default': [], 'func': charts.data_accuracy}
    },
    ('model', 'accountability'): {
        'training_confusion_matrix': {'id': 'training_confusion_matrix', 'title': 'Training Confusion Matrix', 'args': [], 'args_default': [], 'func': charts.training_confusion_matrix},
        'data_confusion_matrix': {'id': 'data_confusion_matrix', 'title': 'Data Confusion Matrix', 'args': [], 'args_default': [], 'func': charts.data_confusion_matrix}
    },
    ('prediction', 'fairness'): {
        'prediction_accuracy': {'id': 'data_accuracy', 'title': 'Data Accuracy', 'args': [], 'args_default': [], 'func': charts.prediction_accuracy}
    },
    ('prediction', 'accountability'): {
        'prediction_confusion_matrix': {'id': 'prediction_confusion_matrix', 'title': 'Prediction Confusion Matrix', 'args': [], 'args_default': [], 'func': charts.prediction_confusion_matrix}
    }
}


# filters out the func. key
# from {(mode, tab) -> {}}
def filter_func(d):
    return {k: {k: v for k, v in v.items() if k != 'func'} for k, v in d.items()}


# returns all {tab -> chart_type, title, [args]}
# for a given mode (d/m/p)
@bp.route('<mode>/all')
def all_chart_types_mode(mode):
    # kinda clunky but w/e
    bigBoy = dict()
    for k in all_charts.keys():
        if mode in k:
            bigBoy[k[1]] = filter_func(all_charts.get(k))
    return jsonify(bigBoy)


# returns {chart_type, title, [args]}
# for a given mode & tab
@bp.route('/<mode>/<tab>/all_combo')
def all_chart_types_combo(mode, tab):
    combo = (mode, tab)
    if combo in all_charts:
        return jsonify(filter_func(all_charts.get(combo)))
    else:
        raise APIArgumentError(
            f'{mode} & {tab} is an invalid mode & tab combination!')


# also takes a query string of argsfunc
# returns {chart_type, args, svg}
# for a given dataset, mode, tab, & type of chart
# (and some args)
@bp.route('/<mode>/<tab>/<chart_type>/<dataset>/<graph>/<graph_model>/<node>/svg')
def svg(dataset, graph, graph_model, node, mode, tab, chart_type):
    combo = (mode, tab)
    if combo in all_charts:
        avail_charts = all_charts.get(combo)
        if chart_type in avail_charts:
            toRender = avail_charts.get(chart_type)

            name = f'{dataset}_{graph}_tree.pickle'
            # TODO: proper error if dataset doesn't exist?
            try:
                file_path = os.path.join(
                    current_app.config['ASSETS_DIR'], 'pickles', name)
                t = load_tree(file_path)

                dataset = None
                if mode == 'data':
                    dataset = t.node_of(node).data
                else:
                    dataset = t.node_of(graph_model).data
                data_2_model = None
                model = None

                if mode == 'model':
                    model, data_2_model = load_model_pickles(
                        dataset, graph_model, graph_model)

                funcArgs = {}
                funcArgs['data_obj'] = dataset
                funcArgs['data_to_model_obj'] = data_2_model
                funcArgs['model_obj'] = model

                svg = None

                parsedArgs = dict()
                if request.args:
                    # try parsing any potential integer args.
                    # doesn't work with negative - but probably OK
                    parsedArgs = {k: (int(v) if v.isdigit() else v)
                                  for k, v in request.args.items()}

                    try:
                        svg = charts.applyArgs(toRender.get(
                            'func'), funcArgs, parsedArgs)
                    except TypeError as e:
                        print(e)
                        raise APIArgumentError(
                            f'Invalid arguments {parsedArgs} for {chart_type}!')
                else:
                    svg = charts.applyArgs(toRender.get('func'), funcArgs)

                #ret = { k: v for k, v in toRender.items() if k not in ['func', 'args', 'title'] }
                ret = dict()
                ret['chart_type'] = chart_type
                ret['svg'] = str(svg[1])
                ret['text'] = svg[0]

                if parsedArgs:
                    ret['args'] = parsedArgs
                return jsonify(ret)
            except IOError as e:
                print(e)
                raise APIArgumentError(f'{name} is an invalid dataset name!')
        else:
            raise APIArgumentError(
                f'{chart_type} is an invalid chart type for {combo}!')
    else:
        raise APIArgumentError(
            f'{mode} & {tab} is an invalid mode & tab combination!')
