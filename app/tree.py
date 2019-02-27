""""""

import numpy as np
from typing import Union, Callable, Any, Dict, List
from fatd.holders.data import Data
from fatd.holders.models import Models
from fatd.holders.predictions import Predictions


NodeData = Union[Data, Models, Predictions, np.ndarray]


class Node:

    def __init__(self, f: Union[None, Callable[[NodeData], Any]]):
        self.f = f
        self.data = None
        self.dirty = False

    def apply(self):
        """Apply the node's function to its data."""
        if self.f is None or self.dirty:
            return
        self.data = self.f(self.data)
        self.dirty = True


class Tree:
    """Wrapper for a D3 graph of nodes which store data.

   TODO: consider using a real tree structure over dict lookups

   Nodes and their children are exposed through a dict lookup. Note that only the parent node will store data
   until Tree.compute() is called: the data is propagated down the tree as functions are applied.

   Args:
       nodes: a D3-style node dict of the form { 'id': '<id>' } (other node data may be present).
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

    def __init__(self, nodes: [dict], links: [dict], data: NodeData):
        # assuming that the first node is the root!!
        self.root = nodes[0]['id']
        self.nodes = {n['id']: Node(n.get('f')) for n in nodes}
        self.nodes[self.root].data = data
        self.children = {key: [] for key in self.nodes}
        for link in links:
            source = link['source']
            target = link['target']
            self.children[source].append(target)

    def node_of(self, key) -> Node:
        return self.nodes[key]

    def children_of(self, key) -> [str]:
        return self.children[key]

    def compute(self):
        """Compute the entire tree by iteratively applying each node's function."""
        next_nodes = [self.root]
        while len(next_nodes) != 0:
            current_id = next_nodes.pop()
            current_node = self.node_of(current_id)
            current_node.apply()

            children = self.children_of(current_id)
            for child_id in children:
                # pass the parent node's data to the child, and add it to the list to be traversed next
                self.node_of(child_id).data = current_node.data
                next_nodes.append(child_id)
