"""Pytest module which tests the /dataset/ endpoints."""

import io
import os
import shutil

import numpy as np
from fatd.holders import csv_loader

from app import create_app
from app import utilities as util


class TestBackendDataset:

    def setup_method(self):
        os.environ['FLASK_CONFIG'] = 'testing'
        app = create_app()
        self.client = app.test_client()
        self.assets = app.config['ASSETS_DIR']
        self.default_data = np.array([[5.1, 3.5, 1.4, 0.2, 1.0],
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

    def teardown_method(self):
        shutil.rmtree(self.assets)

    def test_list_datasets(self):
        util.touch_file(os.path.join(self.assets, 'test1.csv'))
        util.touch_file(os.path.join(self.assets, 'test2.csv'))

        rv = self.client.get('/dataset/view')
        data = rv.get_json()
        assert rv.status_code == 200
        assert 'test1' in data
        assert 'test2' in data

    def test_list_datasets_only_csv(self):
        util.touch_file(os.path.join(self.assets, 'test1.csv'))
        util.touch_file(os.path.join(self.assets, 'test2.pdf'))

        rv = self.client.get('/dataset/view')
        data = rv.get_json()
        assert rv.status_code == 200
        assert 'test1' in data
        assert 'test2' not in data

    def test_view_dataset(self):
        np.savetxt(os.path.join(self.assets, 'default_data.csv'),
                   self.default_data,
                   delimiter=',')

        rv = self.client.get('/dataset/default_data/view')

        expected = csv_loader(os.path.join(self.assets, 'default_data.csv'))
        expected_data = expected.data[:20]
        expected_target = expected.target[:20]

        data = rv.get_json()
        actual_data = np.array(data['data'])[:20]
        actual_target = np.array(data['target'])[:20]

        assert rv.status_code == 200
        assert np.array_equal(actual_data, expected_data)
        assert np.array_equal(actual_target, expected_target)

    def test_view_dataset_nonexistant(self):
        rv = self.client.get('/dataset/error_data/view')
        assert rv.status_code == 400

    def test_rename_dataset(self):
        util.touch_file(os.path.join(self.assets, 'empty_file.csv'))

        rv = self.client.post('/dataset/empty_file/rename', data={
            'new_name': 'new_name'
        })
        assert rv.status_code == 200
        assert os.path.exists(os.path.join(self.assets, 'new_name.csv'))

    def test_rename_dataset_nonexistant(self):
        rv = self.client.post('/dataset/error_data/rename', data={
            'new_name': 'new_name'
        })
        assert rv.status_code == 400

    def test_rename_dataset_bad_params(self):
        util.touch_file(os.path.join(self.assets, 'empty_file.csv'))

        rv = self.client.post('/dataset/empty_file/rename', data={})
        assert rv.status_code == 400

    def test_download_dataset(self):
        np.savetxt(os.path.join(self.assets, 'default_data.csv'),
                   self.default_data,
                   delimiter=',')

        rv = self.client.get('/dataset/default_data/download')
        dataset_file = io.BytesIO(rv.data)
        downloaded = np.loadtxt(dataset_file, delimiter=',')
        assert np.array_equal(self.default_data, downloaded)

    def test_download_dataset_nonexistant(self):
        rv = self.client.get('/dataset/error_data/download')
        assert rv.status_code == 400

    def test_upload_dataset(self):
        dataset_file = io.BytesIO()
        np.savetxt(dataset_file, self.default_data, delimiter=',')
        dataset_file.seek(0)

        rv = self.client.post('/dataset/upload',
                              content_type='multipart/form-data',
                              data={
                                  'dataset_file': (dataset_file, 'default_data.csv'),
                                  'dataset_name': 'default_data'
                              })
        uploaded = np.loadtxt(os.path.join(self.assets, 'default_data.csv'), delimiter=',')
        print(self.default_data)
        print(uploaded)
        assert rv.status_code == 200
        assert np.array_equal(self.default_data, uploaded)

    def test_upload_dataset_bad_params(self):
        rv = self.client.post('/dataset/upload',
                              content_type='multipart/form-data',
                              data={
                                  'dataset_file': 'this is not a file',
                                  'dataset_name': 'default_data'
                              })
        assert rv.status_code == 400
