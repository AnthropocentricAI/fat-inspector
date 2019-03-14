"""Dataset blueprint module for routes to modify datasets."""
from flask import current_app, render_template, request, abort, escape, send_file, jsonify
from flask.blueprints import Blueprint
from app import utilities as util
from app import models
import os


bp = Blueprint('dataset', __name__, url_prefix='/dataset')


def list_datasets():
    return [f[:-4] for f in os.listdir(current_app.config['ASSETS_DIR']) if f.endswith('.csv')]


@bp.route('/view')
def view_all():
    return jsonify(sorted(list_datasets()))


@bp.route('/<name>/view')
def view(name):
    name = util.normalise_path_to_file(name) + '.csv'
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        dataset = models.Dataset.from_path(file_path)
        return escape(dataset)
    except IOError as e:
        print(e)
        abort(400, 'Invalid dataset name.')


# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    if 'dataset_file' not in request.files or 'dataset_name' not in request.form:
        abort(400, 'Invalid request arguments.\n\tdataset_file: <bytes>\n\tdataset_name: <str>')
    csv_bytes = request.files.get('dataset_file').read()
    name = util.normalise_path_to_file(request.form.get('dataset_name')) + '.csv'
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        with open(file_path, 'xb') as f:
            f.write(csv_bytes)
        return 'Success'
    except IOError as e:
        print(e)
        abort(400, 'Dataset already exists or an error occurred when attempting to save the dataset.')


@bp.route('/<name>/rename', methods=['POST'])
def rename(name):
    abort(500, 'Not implemented yet!')


@bp.route('/<name>/download')
def download(name):
    name = util.normalise_path_to_file(name) + '.csv'
    file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
    try:
        return send_file(file_path,
                         as_attachment=True,
                         attachment_filename=name,
                         mimetype='text/csv')
    except IOError as e:
        print(e)
        abort(400, 'Invalid dataset name.')


