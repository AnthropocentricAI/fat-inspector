from app import create_app
from app import models
import sqlalchemy
import pytest
import os

db = models.db


class TestDatabase:

    @classmethod
    def setup_class(cls):
        # app needs to be stored in cls.app_context, so that SQLAlchemy can access it
        os.environ['FLASK_CONFIG'] = 'testing'
        app = create_app()
        cls.app_context = app.app_context()
        cls.app_context.push()

    @classmethod
    def teardown_class(cls):
        cls.app_context.pop()

    def setup_method(self):
        db.create_all()

    def teardown_method(self):
        # PostgreSQL is finicky about table locks, close the connection BEFORE dropping tables
        # https://docs.sqlalchemy.org/en/latest/faq/metadata_schema.html#my-program-is-hanging-when-i-say-table-drop-metadata-drop-all
        db.session.close()
        db.drop_all()

    def test_setup(self):
        # just do nothing to check that the setup/teardown methods work correctly
        pass

    def test_null_graph(self):
        g = models.Graph(path='assets/test.csv')
        with pytest.raises(sqlalchemy.exc.IntegrityError):
            db.session.add(g)
            db.session.commit()

    def test_invalid_path(self):
        with pytest.raises(IOError):
            _ = models.Graph(type=0, name='test_invalid_path', path='invalid_path.csv', data={})

    def test_non_csv_path(self):
        with pytest.raises(ValueError):
            _ = models.Graph(type=0, name='test_non_csv_path', path='assets/not_csv.txt', data={})

    def test_valid_csv_path(self):
        g = models.Graph(type=0, name='test_valid_csv_path', path='assets/test.csv', data={})
        db.session.add(g)
        db.session.commit()

    def test_utf8_string(self):
        g = models.Graph(type=0, name='test_utf8_string_база_данных', path='assets/test.csv', data={})
        db.session.add(g)
        db.session.commit()
