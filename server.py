from flask import Flask
from flask import render_template
from flask.ext.scss import scss

app = Flask(__name__)
app.testing = True
Scss(app, static_dir='static', asset_dir='static/scss')

@app.route('/')
def index():
    return 'Hello world!'

@app.route('/tool')
def tool():
    return render_template('tool.html')

if __name__ == "__main__":
    app.run()