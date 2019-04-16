import os
import shutil

import fatd.holders.loaders
import fatd.transform.data
import numpy as np
from fatd.holders import Data
from pytest import raises

from app.config import TestingConfig
from app.exceptions import TreeComputationError
from app.functions import funcs
from app.tree import Node
from app.tree import build_tree


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
        self.assets = TestingConfig.ASSETS_DIR
        try:
            os.mkdir(self.assets)
        except IOError:
            pass
        self.default_path = os.path.join(self.assets, 'default_data.csv')
        np.savetxt(self.default_path, data, delimiter=',')

    def teardown_method(self):
        shutil.rmtree(self.assets)

    def test_null_function_is_identity(self):
        node = Node(None, self.default_data)
        node.apply()
        assert np.array_equal(self.default_data.data, node.data.data)
        assert not node.dirty

    def test_apply_equal(self):
        func = np.mean
        node = Node(func, self.default_data)
        node.apply()
        expected = self.default_data.apply(func)
        assert np.array_equal(expected.data, node.data.data)
        assert node.dirty

    def test_repeat_apply_once(self):
        func = fatd.transform.data.mean
        node = Node(func, self.default_data)
        node.apply()
        node.apply()
        expected = self.default_data.apply(func)
        assert np.array_equal(expected.data, node.data.data)

    def test_build_depth_two(self):
        graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        }
        t = build_tree(self.default_data, graph)
        for n in graph['nodes']:
            assert n['id'] in t.nodes
            assert isinstance(t.nodes[n['id']], Node)
        assert 'Alice' in t.children['Bob']
        assert 'James' in t.children['Bob']

    def test_build_depth_three(self):
        graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}, {'id': 'Sam'}, {'id': 'Chris'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'},
                      {'source': 'Alice', 'target': 'Sam'}, {'source': 'James', 'target': 'Chris'}]
        }
        t = build_tree(self.default_data, graph)
        for n in graph['nodes']:
            assert n['id'] in t.nodes
            assert isinstance(t.nodes[n['id']], Node)
        assert 'Alice' in t.children['Bob']
        assert 'James' in t.children['Bob']
        assert 'Sam' in t.children['Alice']
        assert 'Chris' in t.children['James']

    def test_build_function_mappings(self):
        graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice', 'function': 'fatd.transform.data.median'},
                      {'id': 'James', 'function': 'fatd.transform.data.mean'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        }
        t = build_tree(self.default_data, graph)
        assert t.node_of('Bob').func is None
        assert t.node_of('Alice').func == funcs.get('fatd.transform.data.median')
        assert t.node_of('James').func == funcs.get('fatd.transform.data.mean')

    def test_build_load_dataset(self):
        graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice'}, {'id': 'James'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        }
        t = build_tree(self.default_data, graph)
        actual_data = t.node_of(t.root).data
        assert np.array_equal(actual_data.data, self.default_data.data)
        assert np.array_equal(actual_data.target, self.default_data.target)

    def test_compute_depth_two(self):
        graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice', 'function': 'fatd.transform.data.median'},
                      {'id': 'James', 'function': 'fatd.transform.data.mean'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        }
        t = build_tree(self.default_data, graph)
        t.compute()
        assert np.array_equal(t.node_of('Bob').data.data, self.default_data.data)
        assert np.array_equal(t.node_of('Alice').data.data,
                              t.node_of('Bob').data.apply(fatd.transform.data.median).data)
        assert np.array_equal(t.node_of('James').data.data, t.node_of('Bob').data.apply(fatd.transform.data.mean).data)

    def test_compute_depth_three(self):
        graph = {
            'nodes': [{'id': 'Bob'},
                      {'id': 'Alice', 'function': 'fatd.transform.data.median'},
                      {'id': 'James', 'function': 'fatd.transform.data.mean'},
                      {'id': 'Laura', 'function': 'fatd.transform.data.median'},
                      {'id': 'Chris', 'function': 'fatd.transform.data.mean'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'},
                      {'source': 'Alice', 'target': 'Laura'}, {'source': 'James', 'target': 'Chris'}]
        }
        t = build_tree(self.default_data, graph)
        t.compute()
        assert np.array_equal(t.node_of('Bob').data.data, self.default_data.data)
        assert np.array_equal(t.node_of('Alice').data.data,
                              t.node_of('Bob').data.apply(fatd.transform.data.median).data)
        assert np.array_equal(t.node_of('James').data.data, t.node_of('Bob').data.apply(fatd.transform.data.mean).data)
        assert np.array_equal(t.node_of('Laura').data.data,
                              t.node_of('Alice').data.apply(fatd.transform.data.median).data)
        assert np.array_equal(t.node_of('Chris').data.data,
                              t.node_of('James').data.apply(fatd.transform.data.mean).data)

    def test_compute_failure(self):
        graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice', 'function': 'fatd.transform.data.median'},
                      {'id': 'James', 'function': 'fatd.transform.data.mean'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        }
        t = build_tree(None, graph)
        with raises(TreeComputationError) as e_info:
            t.compute()
            assert 'Bob' in e_info.value.message
