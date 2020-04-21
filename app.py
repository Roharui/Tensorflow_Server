
from flask import Flask, redirect, url_for, render_template
from flask import request
import numpy as np, pandas as pd
import io

app = Flask(__name__)

allow_file = ['application/vnd.ms-excel']

@app.route('/')
def index():
    return render_template('index_bs.html')

@app.route('/dataset', methods=['POST'])
def dataset():
    file = request.files['file']
    if file.mimetype in allow_file:
        readAsCsv(file.read().decode('utf8'))
    return redirect(url_for('index'))

def readAsCsv(file):
    df = pd.read_csv(io.StringIO(file))
    print(df.head())

if __name__ == "__main__":              
    app.run(host="0.0.0.0", port="80")