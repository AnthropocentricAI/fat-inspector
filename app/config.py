import os


class Config():
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    ASSETS_DIR = 'assets'


class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = True


class ProductionConfig(Config):
    DEBUG = False
    TESTING = False


config = {
    'heroku': ProductionConfig,
    'testing': DevelopmentConfig,
    'development': DevelopmentConfig,
    'default': DevelopmentConfig
}