from flask import Flask
from flask import render_template

app = Flask(__name__)

@app.route('/')
def index():
    return 'Hello world!'

@app.route('/tool')
def tool():
    return render_template('tool.html')

if __name__ == "__main__":
    app.run()