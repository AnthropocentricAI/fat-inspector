from app import create_app
from app import models
import sqlalchemy
import pytest

db = models.db


class TestDatabase:

    @classmethod
    def setup_class(cls):
        # app needs to be stored in cls.app_context, so that SQLAlchemy can access it
        app = create_app('testing')
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

    def test_insert_dataset(self):
        d = models.Dataset(name='test_insert_dataset', data=b'')
        db.session.add(d)
        db.session.commit()

    def test_insert_dataset_utf8(self):
        d = models.Dataset(name='test_insert_dataset_база_данных', data=b'')
        db.session.add(d)
        db.session.commit()

    def test_fetch_dataset(self):
        d = models.Dataset(id=0, name='test_fetch_dataset', data=b'')
        db.session.add(d)
        db.session.commit()
        fetched = models.Dataset.query.get(0)
        assert fetched == d

    def test_null_dataset(self):
        d = models.Dataset()
        # d should fail the non-null constraint for name
        with pytest.raises(sqlalchemy.exc.IntegrityError):
            db.session.add(d)
            db.session.commit()

    def test_null_graph(self):
        g = models.Graph()
        # d should fail the non-null constraint for name
        with pytest.raises(sqlalchemy.exc.IntegrityError):
            db.session.add(g)
            db.session.commit()