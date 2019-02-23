""""""

import numpy as np
from typing import Union, Callable, Any
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
    """Wrapper class for D3 nodes and links."""

    def __init__(self, nodes: [dict], links: [dict], data: NodeData):
        """Creates a tree of Nodes from a D3 graph.

        Note that the data is stored in the root ONLY until Tree.compute()
        is called to propagate the transformed data down the tree.

        :param nodes: List of D3 nodes as {'id': <id>, 'f': <function>}.
        :param links: List of D3 links as {'source': <source>, 'target': <target>}
        :param data: Data which is stored in each node.
        """
        # assuming that the first node is the root!!
        self.root = nodes[0]['id']
        self.nodes = {n['id']: Node(n.get('f')) for n in nodes}
        self.nodes[self.root].data = data
        self.children = {key: [] for key in self.nodes}
        for link in links:
            source = link['source']
            target = link['target']
            self.children[source].append(target)

    def fetch_node(self, key):
        return self.nodes[key]

    def fetch_children(self, key):
        return self.children[key]

    def compute(self):
        """Compute the entire tree by iteratively applying each node's function."""
        nodes = [self.root]
        while len(nodes) != 0:
            # get the current node and apply its function
            current = nodes.pop()
            self.nodes[current].apply()

            # DFS
            children = self.children[current]
            for child in children:
                self.nodes[child].data = self.nodes[current].data
                nodes.append(child)
