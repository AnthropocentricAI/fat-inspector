from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, JSON, ForeignKey, LargeBinary


db = SQLAlchemy()


class Dataset(db.Model):
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    path = Column(String, nullable=False)

    def __repr__(self):
        return '''<Dataset '{}' id#{}>'''.format(self.name, self.id)


class Graph(db.Model):
    id = Column(Integer, primary_key=True)
    type = Column(Integer, nullable=False)
    name = Column(String, nullable=False)
    dataset_id = Column(Integer, ForeignKey('dataset.id'))
    data = Column(JSON, nullable=False)

    def __repr__(self):
        return '''<Graph '{}' type: {} id#{} dataset_id#{}>'''.format(self.name, 
                                                                      self.type, 
                                                                      self.id, 
                                                                      self.dataset_id)
