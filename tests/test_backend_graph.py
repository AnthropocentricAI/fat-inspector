"""Pytest module which tests the /graph/ endpoints."""

import os
import io
from app import create_app
from app import utilities as util


class TestBackendGraph:

    def setup_method(self):
        os.environ['FLASK_CONFIG'] = 'testing'
        app = create_app()
        self.client = app.test_client()
        self.assets = app.config['ASSETS_DIR']

    def teardown_method(self):
        for f in os.listdir(self.assets):
            os.remove(os.path.join(self.assets, f))
        os.rmdir(self.assets)

    def test_upload_graph(self):
        graph_file = io.BytesIO()
        graph_file.write(b'testbytes')

        rv = self.client.post('/graph/upload',
                              content_type='multipart/form-data',
                              data={
                                  'graph_file': (graph_file, 'test_graph.json'),
                                  'graph_name': 'test_graph'
                              })
        assert rv.status_code == 200
        assert os.path.exists(os.path.join(self.assets, 'test_graph.json'))

    def test_upload_graph_bad_params(self):
        rv = self.client.post('/graph/upload',
                              content_type='multipart/form-data',
                              data={
                                  'graph_file': ('not a file', 'test_graph.json'),
                                  'graph_name': 'test_graph'
                              })
        assert rv.status_code == 400

    def test_rename_graph(self):
        util.touch_file(os.path.join(self.assets, 'empty_file.json'))

        rv = self.client.post('/graph/empty_file/rename', data={
            'new_name': 'new_name'
        })
        assert rv.status_code == 200
        assert os.path.exists(os.path.join(self.assets, 'new_name.json'))

    def test_rename_graph_nonexistant(self):
        rv = self.client.post('/graph/nonexistant/rename', data={
            'new_name': 'new_name'
        })
        assert rv.status_code == 400

    def test_rename_graph_bad_params(self):
        util.touch_file(os.path.join(self.assets, 'empty_file.csv'))

        rv = self.client.post('/graph/empty_file/rename', data={})
        assert rv.status_code == 400

    def test_duplicate_graph(self):
        assert False

    def test_duplicate_graph_bad_params(self):
        assert False

    def test_duplicate_graph_nonexistant(self):
        assert False

    def test_list_functions(self):
        assert False

    def test_execute_graph(self):
        assert False

    def test_execute_graph_bad_params(self):
        assert False
