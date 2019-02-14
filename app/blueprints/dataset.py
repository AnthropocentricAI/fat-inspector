"""Dataset blueprint module for routes to modify datasets."""
from flask import render_template, request, abort, escape
from flask.blueprints import Blueprint
from app import models
from app.models import db

bp = Blueprint('dataset', __name__, url_prefix='/dataset')


@bp.route('/<name>')
def view(name):
    dataset = models.Dataset.query.filter_by(name=name).first()
    return escape(str(dataset))

# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    if 'csv_file' not in request.files or 'name' not in request.form:
        abort(400)
    csv_bytes = request.files.get('csv_file').read()
    name = request.form.get('name')
    dataset = models.Dataset(name=name, data=csv_bytes)
    db.session.add(dataset)
    db.session.commit()
    return 'Success'


@bp.route('/rename', methods=['POST'])
def rename():
    abort(400, 'Not implemented yet!')


@bp.route('/download')
def download():
    abort(400, 'Not implemented yet!')

