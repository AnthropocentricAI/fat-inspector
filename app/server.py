import os
import json
from app import models
from app import create_app
from flask import render_template, request, abort
#from app import db

#app = create_app(os.getenv('FLASK_CONFIG') or 'default')
app = create_app()

@app.route('/')
def index():
    return 'Hello world!'

@app.route('/tool')
def tool():
    return render_template('tool.html')

@app.cli.command()
def init():
    db.drop_all()
    db.create_all()

@app.route('/uploadDataset', methods=['POST'])
def handle_upload_dataset():
    if 'csv_file' not in request.files or 'name' not in request.form:
        abort(400)
    csv_bytes = b''
    with request.files.get('csv_file').stream as f:
        csv_bytes += bytes(f.read())
    x = models.Dataset(name=request.form.get('name'), data=csv_bytes)
    db.session.add(x)
    db.session.commit()
    return 'Success'

if __name__ == "__main__":
    app.run()