 
import json
import os
from json.decoder import JSONDecodeError
from shutil import copyfile

from flask import current_app
from flask import jsonify
from flask import request
from flask import send_file
from flask.blueprints import Blueprint

from app import utilities as util
from app.exceptions import APIArgumentError

from app.tree import load_tree
from app.blueprints.graph import fetch

import uuid

bp = Blueprint('transition', __name__, url_prefix='/transition')

@bp.route('<graphName>/<nodeID>/model')
def findModel(graphName, nodeID):
    file_path = os.path.join(current_app.config['ASSETS_DIR'], 'pickles', graphName)
    tree = load_tree(file_path)
    
    graph_id = tree.node_of(nodeId).graph_id_model
    if not graph_id:
        graph_id = uuid.uuid4()
        tree.node_of(nodeId).graph_id_model = graph_id
        save_tree(tree, file_path)
    fetch(graph_id)