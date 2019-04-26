""""""

import os
from typing import Any, Dict, List, Union

import dill as pickle
from fatd.holders.data import Data
from fatd.holders.models import Models
from fatd.holders.predictions import Predictions

from app.exceptions import TreeBuildError
from app.exceptions import TreeComputationError
from app.functions import funcs

NodeData = Union[Data, Models, Predictions]
NodeFunction = (Any, List, int)


class Node:
    """Encapsulates a piece of data with a function to be applied to it.

    Attributes:
        func: function to be applied to `data`. May be null if nothing should happen. Should be a tuple in the format
            (<function>, <indices>, <axis>)
        data: the data stored in the node.
        dirty: a bool representing whether the function has already been applied.
    """

    func: NodeFunction
    data: NodeData
    indices: list
    axis: int
    dirty: bool

    def __init__(self, graph_id_model: str, func: NodeFunction, indices: list = None, axis: int = 0, data: NodeData = None):
        self.graph_id_model = graph_id_model
        self.func = func
        self.indices = indices or []
        self.axis = axis
        self.data = data
        self.dirty = False

    def apply(self):
        """Apply the node's function to its data. If self.dirty then it is skipped."""
        if not (self.func is None or self.dirty):
            self.data = self.data.apply(self.func, self.indices, self.axis)
            self.dirty = True

    def __eq__(self, other: 'Node') -> bool:
        # TODO: do something about Datasets not being equal :(
        return self.func == other.func and self.dirty == other.dirty

    def __ne__(self, other: 'Node') -> bool:
        return not self == other


class Tree:
    """Wrapper for a D3 graph of nodes which store data.

   Nodes and their children are exposed through a dict lookup. Note that only the parent node will store data
   until Tree.compute() is called: the data is propagated down the tree as functions are applied.

   Args:
       nodes: a D3-style node dict of the form { 'id': '<id>', 'function': <function> }.
       links: a D3-style links dict of the form { 'source': '<source_node>', 'target': 'target_node' }.
       data: the data which the tree represents.

   Attributes:
       root: the id of the root node of the tree (note that this is assumed to be the first node in `nodes` for now).
       nodes: a dictionary of the form { '<node_id>': <actual_node> } for looking up nodes by id.
       children: a dictionary of the form { '<node_id>': [<node_ids>, ...] } for looking up the ids of children by id.
   """

    root: str
    nodes: Dict[str, Node]
    children: Dict[str, List[str]]
    d3: dict

    def __init__(self, nodes: [dict], links: [dict], data: NodeData):
        graph_id_model = None if 'graphIdModel' not in n else n['graphIdModel']
        self.nodes = {n['id']: Node(graph_id_model, *n['function']) for n in nodes}
        self.children = {key: [] for key in self.nodes}
        possible_roots = list(self.nodes.keys())
        for link in links:
            source = link['source']
            target = link['target']
            self.children[source].append(target)
            try:
                possible_roots.remove(target)
            except ValueError:
                pass
        if len(possible_roots) != 1:
            raise TreeBuildError(f'Expected ONE root node in the tree, got {len(possible_roots)}.')
        self.root = possible_roots[0]
        self.nodes[self.root].data = data

    def node_of(self, key) -> Node:
        return self.nodes[key]

    def children_of(self, key) -> List[str]:
        return self.children[key]

    def compute(self):
        """Compute the entire tree by iteratively applying each node's function."""
        next_nodes = [self.root]
        while len(next_nodes) != 0:
            current_id = next_nodes.pop()
            current_node = self.node_of(current_id)

            try:
                current_node.apply()
            except Exception:
                raise TreeComputationError(current_id, f'Computation failed at node {current_id}.')

            children = self.children_of(current_id)
            for child_id in children:
                # pass the parent node's data to the child, and add it to the list to be traversed next
                self.node_of(child_id).data = current_node.data
                next_nodes.append(child_id)

    def __eq__(self, other: 'Tree') -> bool:
        for k, v in self.nodes.items():
            if other.node_of(k) != v:
                return False
        for k, v in self.children.items():
            if other.children_of(k) != v:
                return False
        return True


def save_tree(tree: Tree, path: str):
    """Pickles the current instance to <path> and creates directories as it goes."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'wb') as f:
        pickle.dump(tree, f)


def load_tree(path: str) -> Tree:
    """Load an instance of Tree from <path>."""
    return pickle.load(open(path, 'rb'))


def build_tree(dataset: NodeData, d3_graph: Dict) -> Tree:
    try:
        nodes = d3_graph['nodes']
        links = d3_graph['links']

        # map the node functions to the REAL functions and unpack the name, indices and axis
        for n in nodes:
            if 'function' in n:
                func_data = n['function']
                func, indices, axis = funcs[func_data['name']], func_data['indices'], func_data['axis']
                n['function'] = (func, indices, axis)
            else:
                n['function'] = (None,)

    except Exception:
        raise TreeBuildError('Failed to build tree! Expected a dict of shape: { nodes: [], links: [] }.')

    tree = Tree(nodes, links, dataset)
    # keep a handle on the d3 graph for later
    tree.d3 = d3_graph
    return tree
