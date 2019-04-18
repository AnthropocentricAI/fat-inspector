class APIArgumentError(Exception):
    """Raise if incorrect arguments have been provided to an API endpoint."""

    message: str
    status_code: int
    payload: dict

    def __init__(self, message, status_code=400, payload=None):
        super().__init__(self)
        self.message = message
        self.payload = payload
        self.status_code = status_code

    def to_dict(self):
        d = dict(self.payload or ())
        d['message'] = self.message
        return d


class TreeComputationError(Exception):
    """Raise if an error occurred while executing a function tree."""

    node_id: str
    message: str

    def __init__(self, node_id, message):
        self.node = node_id
        self.message = message

    def to_dict(self):
        return {'node_id': self.node_id, 'message': self.message}


class TreeBuildError(Exception):
    """Raise if an error occurred while building a function tree."""

    message: str

    def __init__(self, message):
        self.message = message
