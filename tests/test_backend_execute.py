import json
import os
import shutil

import numpy as np
from fatd.holders.data import Data

from app import create_app
from app.tree import build_tree
from app.tree import load_tree


class TestExecution:

    def setup_method(self):
        os.environ['FLASK_CONFIG'] = 'testing'
        app = create_app()
        self.client = app.test_client()
        self.assets = app.config['ASSETS_DIR']
        self.default_arr = np.array([[5.1, 3.5, 1.4, 0.2, 1.0],
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
        self.default_data = Data(self.default_arr[:, :4], self.default_arr[:, 4])
        self.default_graph = {
            'nodes': [{'id': 'Bob'}, {'id': 'Alice', 'function': 'fatd.transform.data.median'},
                      {'id': 'James', 'function': 'fatd.transform.data.mean'}],
            'links': [{'source': 'Bob', 'target': 'Alice'}, {'source': 'Bob', 'target': 'James'}]
        }

    def teardown_method(self):
        shutil.rmtree(self.assets)

    def test_execution(self):
        np.savetxt(os.path.join(self.assets, 'default_data.csv'), self.default_arr, delimiter=',')
        with open(os.path.join(self.assets, 'default_graph.json'), 'w') as f:
            json.dump(self.default_graph, f)

        expected = build_tree(self.default_data, self.default_graph)
        expected.compute()

        rv = self.client.post('/execute/default_data/default_graph')

        assert rv.status_code == 200

        tree = load_tree(os.path.join(self.assets, 'pickles', 'default_data_default_graph_tree.pickle'))
        assert tree == expected
