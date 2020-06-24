
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, InputLayer, Input
import json
import os

ltype = {
    "dense" : Dense
}

class Model:
    def __init__(self):
        self.model = None
        self.history = []

    def create(self, config):
        self.model = Sequential()

        for i in config:
            if i['ltype'] == 'input':
                self.model.add(InputLayer(input_shape=i['inputShape']))
            else:
                self.model.add(Dense(i['units'], name=i['name'], activation=i['activation']))

        self.model.summary()

    def dataset(self, data):
        self.data = data

    def compile(self, config):
        self.model.compile(loss=config['loss'], optimizer=config['optimizer'], metrics=['acc'])

    def fit(self, config):
        h = self.model.fit(self.data['tr_x'], self.data['tr_y'], epochs=config['epochs'], batch_size=config['batch_size'])
        return {"epoch" : h.epoch, "history" : h.history, "params" : h.params}

    def evaluate(self):
        return self.model.evaluate(self.data['te_x'], self.data['te_y'])

    def predict(self, config):
        return self.model.predict(config['data']).argmax(axis=1).tolist()

    def save(self, path):
        p = os.path.join('data', path)
        os.mkdir(p)
        open(os.path.join(p, 'model.json'), 'w').write(self.model.to_json())
        self.model.save_weights(os.path.join(p, 'weight.h5'))

            

