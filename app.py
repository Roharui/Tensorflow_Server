
from flask import Flask, redirect, url_for, render_template
from flask import request
import io

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/dataset', methods=['POST'])
def dataset():
    file = request.files['file']
    return redirect(url_for('index'))

if __name__ == "__main__":              
    app.run(host="0.0.0.0", port="80")