"""Dataset blueprint module for routes to modify datasets."""
import os

from flask import current_app, request, abort, escape, send_file, jsonify
from flask.blueprints import Blueprint
from fatd.holders import csv_loader

from app.exceptions import APIArgumentError
from app import utilities as util

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
        holder = csv_loader(file_path)
        dataset = {
            'data': holder.data[:20].tolist(),
            'target': holder.target[:20].tolist()
        }
        return jsonify(dataset)
    except IOError as e:
        print(e)
        raise APIArgumentError(f'Error when fetching dataset {name}.')


# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    if 'dataset_file' not in request.files or 'dataset_name' not in request.form:
        raise APIArgumentError('Invalid request arguments.\n\tdataset_file: <bytes>\n\tdataset_name: <str>')

    file = request.files.get('dataset_file')
    csv_bytes = file.read()
    name = util.normalise_path_to_file(request.form.get('dataset_name')) + '.csv'

    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        with open(file_path, 'xb') as f:
            f.write(csv_bytes)
        return jsonify({'message': f'Successfully uploaded dataset {file.filename} as {name}.'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'{name} already exists, or an error occurred when attempting to save the dataset.')


@bp.route('/<name>/rename', methods=['POST'])
def rename(name):
    if 'new_name' not in request.form:
        raise APIArgumentError('Invalid request arguments.\n\tnew_name: <str>')
    old_name = util.normalise_path_to_file(name) + '.csv'
    new_name = request.form.get('new_name') + '.csv'
    new_name = os.path.join(current_app.config['ASSETS_DIR'], new_name)
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], old_name)
        os.rename(file_path, new_name)
        return jsonify({'message': f'Successfully renamed {old_name} to {new_name}'})
    except IOError as e:
        print(e)
        raise APIArgumentError(f'{name} does not exist, or {new_name} already exists!')


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
        raise APIArgumentError(f'{name} does not exist!')
