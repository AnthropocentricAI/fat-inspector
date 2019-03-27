"""Graph blueprint module for routes to modify graphs."""

import os

from flask import render_template, request, abort, jsonify, current_app
from flask.blueprints import Blueprint

from app.exceptions import APIArgumentError
from app import models
from app import utilities as util
from app import charts


bp = Blueprint('chart', __name__, url_prefix='/chart')


# (d/m/p, f/a/t) -> { type -> (title, args, func) }
all_charts = {
    ('data', 'accountability'): {
        'class_count': { 'title': 'Class Count', 'args': [], 'func': charts.pieChart }
    },
    ('data', 'fairness'): {
        'histogram': { 'title': 'Histogram', 'args': ['col'], 'func': charts.histogram }
    }
}

# filters out the func. key
# from {(mode, tab) -> {}}
def filterFunc(d):
    return { k: { k: v for k, v in v.items() if k != 'func' } for k, v in d.items()}

# returns all {tab -> chart_type, title, [args]}
# for a given mode (d/m/p)
@bp.route('<mode>/all')
def all_chart_types_mode(mode):
    # kinda clunky but w/e
    bigBoy = dict()
    for k in all_charts.keys():
        if mode in k:
            bigBoy[k[1]] = filterFunc(all_charts.get(k))
    return jsonify(bigBoy)

# returns {chart_type, title, [args]}
# for a given mode & tab
@bp.route('/<mode>/<tab>/all_combo')
def all_chart_types_combo(mode, tab):
    combo = (mode, tab)
    if combo in all_charts:
        return jsonify(filterFunc(all_charts.get(combo)))
    else:
        abort(400, 'Invalid mode & tab combination.')

# also takes a query string of args
# returns {chart_type, args, svg}
# for a given dataset, mode, tab, & type of chart
# (and some args)
@bp.route('/<mode>/<tab>/<chart_type>/<name>/svg')
def svg(name, mode, tab, chart_type):
    combo = (mode, tab)
    if combo in all_charts:
        avail_charts = all_charts.get(combo)
        if chart_type in avail_charts:
            toRender = avail_charts.get(chart_type)

            name = util.normalise_path_to_file(name) + '.csv'
            # TODO: proper error if dataset doesn't exist?
            try:
                file_path = os.path.join(current_app.config['ASSETS_DIR'], name)

                dataset = models.Dataset.from_path(file_path)
                svg = toRender.get('func')(dataset.data)

                svg = None

                parsedArgs = dict()
                if request.args:
                    # try parsing any potential integer args.
                    # doesn't work with negative - but probably OK
                    parsedArgs = { k: (int(v) if v.isdigit() else v) for k, v in request.args.items() }

                    try:
                        svg = toRender.get('func')(dataset.data, **parsedArgs)
                    except TypeError as e:
                        abort(400, 'Invalid arguments {} for {}.'.format(parsedArgs, chart_type))
                        print(e)
                else:
                    svg = toRender.get('func')(dataset.data)

                #ret = { k: v for k, v in toRender.items() if k not in ['func', 'args', 'title'] }
                ret = dict()
                ret['chart_type'] = chart_type
                ret['svg'] = str(svg)

                if parsedArgs: ret['args'] = parsedArgs
                return jsonify(ret)
            except IOError as e:
                abort(400, 'Invalid dataset name.')
                print(e)
        else:
            abort(400, 'Invalid chart type for {}.'.format(combo))
    else:
        abort(400, 'Invalid mode & tab combination.')