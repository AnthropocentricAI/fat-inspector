import os

import fatd.holders.loaders
import fatd.transform.data
from fatd.holders import Data
import numpy as np

from app import tree
from app.functions import funcs


TEST_ASSETS = os.path.join(os.path.dirname(__file__), 'assets')


class TestCompute:

    def setup_method(self):
        data = np.array([[5.1, 3.5, 1.4, 0.2, 1.0],
                         [4.9, 3.0, 1.4, 0.2, 1.0],
                         [4.7, 3.2, 1.3, 0.2, 1.0],
                         [4.6, 3.1, 1.5, 0.2, 1.0],
                         [5.0, 3.6, 1.4, 0.2, 1.0],
                         [5.4, 3.9, 1.7, 0.4, 1.0],
                         [4.6, 3.4, 1.4, 0.3, 1.0],
                         [5.0, 3.4, 1.5, 0.2, 1.0],
                         [4.4, 2.9, 1.4, 0.2, 1.0],
                         [4.9, 3.1, 1.5, 0.1, 1.0],
                         [5.4, 3.7, 1.5, 0.2, 1.0],
                         [4.8, 3.4, 1.6, 0.2, 1.0],
                         [4.8, 3.0, 1.4, 0.1, 1.0]])
        self.default_data = Data(data[:, :4], data[:, 4])
        try:
            os.mkdir(TEST_ASSETS)
        except IOError:
            pass
        np.savetxt(os.path.join(TEST_ASSETS, 'default_data.csv'), data, delimiter=',')

    def teardown_method(self):
        for f in os.listdir(TEST_ASSETS):
            os.remove(os.path.join(TEST_ASSETS, f))
        os.rmdir(TEST_ASSETS)

    def test_null_function_is_identity(self):
        node = tree.Node(None, self.default_data)
        node.apply()
        assert np.array_equal(self.default_data.data, node.data.data)
        assert not node.dirty

    def test_apply_equal(self):
        func = (np.mean, [], 0)
        node = tree.Node(func, self.default_data)
        node.apply()
        expected = self.default_data.apply(*func)
        assert np.array_equal(expected.data, node.data.data)
        assert node.dirty

    def test_repeat_apply_once(self):
        func = (fatd.transform.data.mean, [], 0)
        node = tree.Node(func, self.default_data)
        node.apply()
        node.apply()
        expected = self.default_data.apply(*func)
        assert np.array_equal(expected.data, node.data.data)

    def test_build_depth_two(self):
        graph = {
            'dataset': 'default_data',
            'data': {
                'nodes': [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}],
                'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
            }
        }
        t = tree.build_tree(graph, TEST_ASSETS)
        for n in graph['data']['nodes']:
            assert n['id'] in t.nodes
            assert isinstance(t.nodes[n['id']], tree.Node)
        assert 'Alice' in t.children['Bob']
        assert 'James' in t.children['Bob']

    def test_build_depth_three(self):
        graph = {
            'dataset': 'default_data',
            'data': {
                'nodes': [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}, {'id': 'Sam'}, {'id': 'Chris'}],
                'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'},
                          {'source': 'Alice', 'target': 'Sam'}, {'source': 'James', 'target': 'Chris'}]
            }
        }
        t = tree.build_tree(graph, TEST_ASSETS)
        for n in graph['data']['nodes']:
            assert n['id'] in t.nodes
            assert isinstance(t.nodes[n['id']], tree.Node)
        assert 'Alice' in t.children['Bob']
        assert 'James' in t.children['Bob']
        assert 'Sam' in t.children['Alice']
        assert 'Chris' in t.children['James']

    def test_build_function_mappings(self):
        graph = {
            'dataset': 'default_data',
            'data': {
                'nodes': [{'id': 'Bob'}, {'id': 'Alice', 'function': ['fatd.transform.data.median', [], 0]},
                          {'id': 'James', 'function': ['fatd.transform.data.mean', [], 0]}],
                'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
            }
        }
        t = tree.build_tree(graph, TEST_ASSETS)
        assert t.node_of('Bob').func is None
        assert t.node_of('Alice').func[0] == funcs.get('fatd.transform.data.median')
        assert t.node_of('James').func[0] == funcs.get('fatd.transform.data.mean')

    def test_build_load_dataset(self):
        graph = {
            'dataset': 'default_data',
            'data': {
                'nodes': [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}],
                'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
            }
        }
        t = tree.build_tree(graph, TEST_ASSETS)
        actual_data = t.node_of(t.root).data
        assert np.array_equal(actual_data.data, self.default_data.data)
        assert np.array_equal(actual_data.target, self.default_data.target)

    def test_compute_depth_two(self):
        graph = {
            'dataset': 'default_data',
            'data': {
                'nodes': [{'id': 'Bob'}, {'id': 'Alice', 'function': ['fatd.transform.data.median', [], 0]},
                          {'id': 'James', 'function': ['fatd.transform.data.mean', [], 0]}],
                'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
            }
        }
        t = tree.build_tree(graph, TEST_ASSETS)
        t.compute()
        assert np.array_equal(t.node_of('Bob').data.data, self.default_data.data)
        assert np.array_equal(t.node_of('Alice').data.data,
                              t.node_of('Bob').data.apply(fatd.transform.data.median).data)
        assert np.array_equal(t.node_of('James').data.data, t.node_of('Bob').data.apply(fatd.transform.data.mean).data)

    def test_compute_depth_three(self):
        graph = {
            'dataset': 'default_data',
            'data': {
                'nodes': [{'id': 'Bob'},
                          {'id': 'Alice', 'function': ['fatd.transform.data.median', [], 0]},
                          {'id': 'James', 'function': ['fatd.transform.data.mean', [], 0]},
                          {'id': 'Laura', 'function': ['fatd.transform.data.median', [2], 1]},
                          {'id': 'Chris', 'function': ['fatd.transform.data.mean', [1], 1]}],
                'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'},
                          {'source': 'Alice', 'target': 'Laura'}, {'source': 'James', 'target': 'Chris'}]
            }
        }
        t = tree.build_tree(graph, TEST_ASSETS)
        t.compute()
        assert np.array_equal(t.node_of('Bob').data.data, self.default_data.data)
        assert np.array_equal(t.node_of('Alice').data.data,
                              t.node_of('Bob').data.apply(fatd.transform.data.median).data)
        assert np.array_equal(t.node_of('James').data.data, t.node_of('Bob').data.apply(fatd.transform.data.mean).data)
        assert np.array_equal(t.node_of('Laura').data.data,
                              t.node_of('Alice').data.apply(fatd.transform.data.median, [2], 1).data)
        assert np.array_equal(t.node_of('Chris').data.data,
                              t.node_of('James').data.apply(fatd.transform.data.mean, [1], 1).data)
