import os

import pytest
import sqlalchemy

from app import create_app
from app import models


db = models.db


class TestDatabase:

    def setup_method(self):
        os.environ['FLASK_CONFIG'] = 'testing'
        app = create_app()
        self.app_context = app.app_context()
        self.app_context.push()
        self.assets = app.config['ASSETS_DIR']
        db.create_all()

    def teardown_method(self):
        for f in os.listdir(self.assets):
            os.remove(os.path.join(self.assets, f))
        os.rmdir(self.assets)
        # PostgreSQL is finicky about table locks, close the connection BEFORE dropping tables
        # https://docs.sqlalchemy.org/en/latest/faq/metadata_schema.html#my-program-is-hanging-when-i-say-table-drop-metadata-drop-all
        db.session.close()
        db.drop_all()
        self.app_context.pop()

    def test_setup(self):
        # just do nothing to check that the setup/teardown methods work correctly
        pass

    def test_null_graph(self):
        with open(os.path.join(self.assets, 'test.csv'), 'w'):
            pass
        g = models.Graph(path=os.path.join(self.assets, 'test.csv'))
        with pytest.raises(sqlalchemy.exc.IntegrityError):
            db.session.add(g)
            db.session.commit()

    def test_invalid_path(self):
        with pytest.raises(IOError):
            _ = models.Graph(type=0, name='test_invalid_path', path='invalid_path.csv', data={})

    def test_non_csv_path(self):
        with open(os.path.join(self.assets, 'not_csv.txt'), 'w'):
            pass
        with pytest.raises(ValueError):
            _ = models.Graph(type=0, name='test_non_csv_path', path=os.path.join(self.assets, 'not_csv.txt'), data={})

    def test_valid_csv_path(self):
        with open(os.path.join(self.assets, 'test.csv'), 'w'):
            pass
        g = models.Graph(type=0, name='test_valid_csv_path', path=os.path.join(self.assets, 'test.csv'), data={})
        db.session.add(g)
        db.session.commit()

    def test_utf8_string(self):
        with open(os.path.join(self.assets, 'test.csv'), 'w'):
            pass
        g = models.Graph(type=0, name='test_utf8_string_база_данных', path=os.path.join(self.assets, 'test.csv'),
                         data={})
        db.session.add(g)
        db.session.commit()
