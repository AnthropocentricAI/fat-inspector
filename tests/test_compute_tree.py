
import numpy as np
from app.tree import Node, Tree


class TestCompute:

    def test_null_function_is_identity(self):
        data = np.array([1, 2, 3])
        node = Node(None)
        node.data = data
        node.apply()
        assert np.array_equal(data, node.data)
        assert not node.dirty

    def test_apply_equal(self):
        data = np.array([[1, 2], [3, 4]])
        f = np.mean
        node = Node(f)
        node.data = data
        node.apply()
        assert np.array_equal(f(data), node.data)
        assert node.dirty

    def test_repeat_apply_once(self):
        data = np.array([0])
        node = Node(lambda x: x + 1)
        node.data = data
        node.apply()
        node.apply()
        assert np.array_equal(node.data, np.array([1]))

    def test_construct_depth_two(self):
        nodes = [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}]
        links = [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        data = np.array([])
        tree = Tree(nodes, links, data)
        for n in nodes:
            assert n['id'] in tree.nodes
            assert isinstance(tree.nodes[n['id']], Node)
        assert 'Alice' in tree.children['Bob']
        assert 'James' in tree.children['Bob']

    def test_construct_depth_three(self):
        nodes = [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}, {'id': 'Sam'}, {'id': 'Chris'}]
        links = [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'},
                 {'source': 'Alice', 'target': 'Sam'}, {'source': 'James', 'target': 'Chris'}]
        data = np.array([])
        tree = Tree(nodes, links, data)
        for n in nodes:
            assert n['id'] in tree.nodes
            assert isinstance(tree.nodes[n['id']], Node)
        assert 'Alice' in tree.children['Bob']
        assert 'James' in tree.children['Bob']
        assert 'Sam' in tree.children['Alice']
        assert 'Chris' in tree.children['James']

    def test_compute_depth_two(self):
        nodes = [{'id': 'Bob'}, {'id': 'Alice', 'f': np.mean}, {'id': 'James', 'f': np.median}]
        links = [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        data = np.array([[1, 2], [3, 4]])
        tree = Tree(nodes, links, data)
        tree.compute()
        assert np.array_equal(tree.nodes['Bob'].data, data)
        assert np.array_equal(tree.nodes['Alice'].data, np.mean(data))
        assert np.array_equal(tree.nodes['James'].data, np.median(data))

    def test_compute_depth_three(self):
        nodes = [{'id': 'Bob'}, {'id': 'Alice', 'f': np.mean}, {'id': 'James', 'f': np.median},
                 {'id': 'Sam', 'f': lambda x: x + 100}, {'id': 'Chris', 'f': lambda x: x ** 5}]
        links = [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'},
                 {'source': 'Alice', 'target': 'Sam'}, {'source': 'James', 'target': 'Chris'}]
        data = np.array([[1, 2], [3, 4]])
        tree = Tree(nodes, links, data)
        tree.compute()
        assert np.array_equal(tree.nodes['Bob'].data, data)
        assert np.array_equal(tree.nodes['Alice'].data, np.mean(data))
        assert np.array_equal(tree.nodes['James'].data, np.median(data))
        assert np.array_equal(tree.nodes['Sam'].data, np.mean(data) + 100)
        assert np.array_equal(tree.nodes['Chris'].data, np.median(data) ** 5)
