
from flask import Flask, redirect, url_for, render_template
from flask import request
import numpy as np, pandas as pd
import io
import json
from train import Model

app = Flask(__name__)

allow_file = ['application/vnd.ms-excel']

count = 0

codes = {}

@app.route('/')
def index():
    return render_template('index_bs.html')

@app.route('/server')
def index_server():
    return render_template('index_server.html')

# @app.route('/dataset', methods=['POST'])
# def dataset():
#     file = request.files['file']
#     if file.mimetype in allow_file:
#         readAsCsv(file.read().decode('utf8'))
#     return redirect(url_for('index'))

@app.route('/dataset/<code>', methods=['POST'])
def data(code):
    global codes

    x = request.json
    codes[str(code)].dataset(x)

    return json.dumps({'ok' : 'ok'})

@app.route('/layers/<code>', methods=['POST'])
def layers(code):
    global codes

    x = request.json

    codes[str(code)].create(x)

    return json.dumps({'code' : 200})

@app.route('/compile/<code>', methods=['POST'])
def compile(code):
    global count, codes

    x = request.json

    codes[str(count)].compile(x)

    return json.dumps({'code' : 200})

@app.route('/fit/<code>', methods=['POST'])
def fit(code):
    global count, codes

    x = request.json

    his = codes[str(count)].fit(x)

    return json.dumps(str(his))


@app.route('/code', methods=['POST'])
def codeMaker():
    global count, codes
    count += 1

    codes[str(count)] = Model()

    return json.dumps({'code' : count})

def readAsCsv(file):
    df = pd.read_csv(io.StringIO(file))
    print(df.head())

if __name__ == "__main__":              
    app.run(host="0.0.0.0", port="80")