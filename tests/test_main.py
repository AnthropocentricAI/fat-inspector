from app import create_app
from app.models import db
from app import models

app = create_app('testing')

def init_db():
    with app.app_context():
        db.drop_all()
        db.create_all()
    
def test_init():
    init_db()

def test_insert_dataset():
    """Inserts a single 'Dataset' row."""
    init_db()
    with app.app_context():
        d = models.Dataset(id=0, name="test_insert_dataset", data=b'')
        db.session.add(d)
        db.session.commit()

def test_insert_graph():
    """Inserts a new dataset and graph which are linked by foreign key."""
    init_db()
    with app.app_context():
        d = models.Dataset(id=0, name="test_insert_graph_d", data=b'')
        g = models.Graph(id=0, type=0, name='test_insert_graph_g', dataset_id=0, data={})
        db.session.add(d)
        db.session.commit()
        db.session.add(g)
        db.session.commit()

def test_select():
    """Inserts a new dataset, fetches it, then asserts the two are equal."""
    init_db()
    with app.app_context():
        d = models.Dataset(id=0, name="test_select_dataset", data=b'')
        db.session.add(d)
        db.session.commit()
        fetched_d = models.Dataset.query.get(0)
        assert d == fetched_d
