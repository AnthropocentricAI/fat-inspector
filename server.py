from flask import Flask
from flask import render_template
from sassutils.wsgi import SassMiddleware

app = Flask(__name__)
app.wsgi_app = SassMiddleware(app.wsgi_app, {
    'app' : ('static/scss', 'static/css', '/static/css')
})

@app.route('/')
def index():
    return 'Hello world!'

@app.route('/tool')
def tool():
    return render_template('tool.html')

if __name__ == "__main__":
    app.run()