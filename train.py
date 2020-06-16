
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, InputLayer, Input
import json

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
            

