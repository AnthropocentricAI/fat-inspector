import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ASSETS_DIR = 'assets'


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = True


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    ASSETS_DIR = os.path.join(os.path.dirname(__file__), '..', 'tests', 'assets')


config = {
    'heroku': ProductionConfig,
    'testing': TestingConfig,
    'development': DevelopmentConfig,
    'default': DevelopmentConfig
}