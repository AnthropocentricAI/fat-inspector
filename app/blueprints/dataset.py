"""Dataset blueprint module for routes to modify datasets."""
from flask import current_app, render_template, request, abort, escape, send_file
from flask.blueprints import Blueprint
from app import utilities as util
import fatd.holders
import os

bp = Blueprint('dataset', __name__, url_prefix='/dataset')


@bp.route('/view')
def view_all():
    files = [f[:-4] for f in os.listdir(current_app.config['ASSETS_DIR']) if f.endswith('.csv')]
    return render_template('dataset_view.html', files=files)


@bp.route('/<name>/view')
def view(name):
    name = util.normalise_path_to_file(name) + '.csv'
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        data = fatd.holders.csv_loader(file_path)
        target = data.target[:10]
        return str(data.data[:10]) + '<br/>' + str(target[:10])
    except IOError as e:
        print(e)
        abort(400, 'Invalid dataset name.')


# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    if 'csv_file' not in request.files or 'name' not in request.form:
        abort(400, 'Invalid request arguments.\n\tcsv_file: <bytes>\n\tname: <str>')
    csv_bytes = request.files.get('csv_file').read()
    name = util.normalise_path_to_file(request.form.get('name')) + '.csv'
    try:
        file_path = os.path.join(current_app.config['ASSETS_DIR'], name)
        with open(file_path, 'wb') as f:
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


