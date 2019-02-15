from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, JSON,orm
import os


db = SQLAlchemy()


class Graph(db.Model):
    id = Column(Integer, primary_key=True)
    type = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)
    data = Column(JSON, nullable=False)

    def __init__(self, **kwargs):
        super(Graph, self).__init__(**kwargs)
        if not os.path.exists(self.path):
            raise IOError('Dataset file path does not exist.')
        if not self.path.endswith('.csv'):
            raise ValueError('Datasets must be a .csv file.')

    def __repr__(self):
        return '''<Graph '{}' type: {} id#{} dataset_id#{}>'''.format(self.name, 
                                                                      self.type, 
                                                                      self.id, 
                                                                      self.dataset_id)
