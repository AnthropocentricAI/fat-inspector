"""Pytest module which tests the /graph/ endpoints."""

import os
import io
from app import create_app


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
        assert False

    def test_rename_graph(self):
        assert False

    def test_rename_graph_bad_params(self):
        assert False

    def test_list_functions(self):
        assert False

    def test_execute_graph(self):
        assert False

    def test_execute_graph_bad_params(self):
        assert False