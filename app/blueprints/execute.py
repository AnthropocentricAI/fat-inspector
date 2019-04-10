from flask.blueprints import Blueprint


bp = Blueprint('execute', __name__, url_prefix='execute')


@bp.route('/<dataset>/<graph>')
def execute(dataset, graph):
    pass
