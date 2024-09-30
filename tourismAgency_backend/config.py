import os

basedir = os.path.abspath(os.path.dirname(__file__))

# PostgreSQL Database
SQLALCHEMY_DATABASE_URI = 'postgresql://postgres:postgres@localhost:1234/dawdb'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY='daw-backend-secret-key-suciu-radu'