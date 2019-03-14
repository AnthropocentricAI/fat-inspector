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
