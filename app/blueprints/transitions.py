 
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

bp = Blueprint('transition', __name__, url_prefix='/transition')

@bp.route('<graphName>/<nodeID>/model')
def findModel(graphName, nodeID):
    path = 'idk'
    tree = load_tree(path)
    
    node = tree.node_of(nodeId).