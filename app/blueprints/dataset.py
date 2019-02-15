"""Dataset blueprint module for routes to modify datasets."""
from flask import render_template, request, abort, escape, send_file
from flask.blueprints import Blueprint
from app import models
from app.models import db
import io

bp = Blueprint('dataset', __name__, url_prefix='/dataset')


@bp.route('/<name>')
def view(name):
    dataset = models.Dataset.query.filter_by(name=name).first()
    return escape(str(dataset))

# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    if 'csv_file' not in request.files or 'name' not in request.form:
        abort(400, 'Invalid request arguments.\n\tcsv_file: <bytes>\n\tname: <str>')
    csv_bytes = request.files.get('csv_file').read()
    name = request.form.get('name')
    dataset = models.Dataset(name=name, data=csv_bytes)
    db.session.add(dataset)
    db.session.commit()
    return 'Success'


@bp.route('/rename', methods=['POST'])
def rename():
    if 'old_name' not in request.form or 'new_name' not in request.form:
        abort(400, 'Invalid request arguments.\n\told_name: <str>\n\tnew_name: <str>')
    old_name = request.form.get('old_name')
    new_name = request.form.get('new_name')
    models.Dataset.query.filter_by(name=old_name).update(dict(name=new_name))
    db.session.commit()
    return 'Success'

@bp.route('/download')
def download():
    if 'name' not in request.args:
        abort(400, 'Invalid request arguments.\n\tname: <str>')
    name = request.args.get('name')
    dataset = models.Dataset.query.filter_by(name=name).first()
    return send_file(io.BytesIO(dataset.data),
                     as_attachment=True,
                     attachment_filename=name + '.csv',
                     mimetype='text/csv')


