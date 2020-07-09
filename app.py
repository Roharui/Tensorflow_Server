
from flask import Flask, redirect, url_for, render_template
from flask import request
import numpy as np, pandas as pd
import io
import json
from train import Model
from code_creater import create_code
import os

app = Flask(__name__)

allow_file = ['application/vnd.ms-excel']

count = 0

codes = {}

tr_model = {}

@app.route('/')
def index():
    return render_template('index_bs.html')

@app.route('/server')
def index_server():
    return render_template('index_server.html')

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

    print(x)

    codes[str(count)].compile(x)

    return json.dumps({'code' : 200})

@app.route('/predict/<code>', methods=['POST'])
def predict(code):
    global count, codes

    x = request.json

    result = codes[str(count)].predict(x)

    return json.dumps(str(result))

@app.route('/evaluate/<code>', methods=['POST'])
def evaluate(code):
    global count, codes

    result = codes[str(count)].evaluate()

    return json.dumps(str(result))

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

@app.route('/server_upload/<code>', methods=['POST'])
def uploader(code):
    global count, codes, tr_model
    x = request.json
    model = codes[str(count)]

    pcode = create_code()

    model.save(pcode)

    tr_model[pcode] = model

    return json.dumps({'code' : pcode})

@app.route('/model/<pcode>', methods=['POST'])
def do_model(pcode):
    global tr_model

    x = request.json

    try:

        model = tr_model[pcode]

        result = model.predict(x)
    
    except Exception:
        return "No Model"

    return json.dumps(str(result))

def readAsCsv(file):
    df = pd.read_csv(io.StringIO(file))
    print(df.head())

if __name__ == "__main__":

    app.run(host="0.0.0.0", port="80")