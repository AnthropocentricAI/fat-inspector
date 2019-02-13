"""Dataset blueprint module for routes to modify datasets."""


from flask import render_template, request, abort
from flask.blueprints import Blueprint


bp = Blueprint('dataset', __name__, url_prefix='/dataset')


# TODO: implement placeholder routes
@bp.route('/upload', methods=['POST'])
def upload():
    abort(400, 'Not implemented yet!')


@bp.route('/rename', methods=['POST'])
def rename():
    abort(400, 'Not implemented yet!')


@bp.route('/download')
def download():
    abort(400, 'Not implemented yet!')

