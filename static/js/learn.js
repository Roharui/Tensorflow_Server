

const loss = [
    'meanSquaredError',
    'meanAbsoluteError',
    'meanAbsolutePercentageError',
    'meanSquaredLogarithmicError',
    'squaredHinge',
    'hinge',
    'categoricalHinge',
    'logcosh',
    'categoricalCrossentropy',
    'sparseCategoricalCrossentropy',
    'binaryCrossentropy',
    'kullbackLeiblerDivergence',
    'poisson',
    'cosineProximity'
]

const optimizer = [
    'Adagrad',
    'Adadelta',
    'Adam',
    'Adamax',
    'RMSProp',
    'SGD'
]

const metrics = [
    'accuracy'
]

const Learn = {
    compile(){
        tfvis.visor().surface({name: 'My First Surface', tab: 'train'});
        ModelMaker.model.compile(
            {
                optimizer: 'adam', 
                loss: 'categoricalCrossentropy',
                metrics: ["accuracy"]
            }
        )
    },

    async fit(){
        const metrics = ['loss', 'acc'];
        const container = {
            name: 'show.fitCallbacks',
            tab: 'Training',
            styles: {
                height: '1000px'
            }
        };
        const callbacks = tfvis.show.fitCallbacks(container, metrics);
        return await ModelMaker.model.fit( P.tensor.train.x, P.tensor.train.y,
            {
                batch_size : 10,
                epochs : 5,
                callbacks: callbacks
            }
        )
    },



}

async function train(model, data, fitCallbacks) {
    const BATCH_SIZE = 64;
    const trainDataSize = 500;
    const testDataSize = 100;
    const [trainXs, trainYs] = tf.tidy(() => {
      const d = data.nextTrainBatch(trainDataSize);
      return [d.xs.reshape([trainDataSize, 28, 28, 1]), d.labels];
    });
    const [testXs, testYs] = tf.tidy(() => {
      const d = data.nextTestBatch(testDataSize);
      return [d.xs.reshape([testDataSize, 28, 28, 1]), d.labels];
    });
    return model.fit(trainXs, trainYs, {
      batchSize: BATCH_SIZE,
      validationData: [testXs, testYs],
      epochs: 10,
      shuffle: true,
      callbacks: fitCallbacks
    });
}

async function watchTraining() {
    const metrics = ['loss', 'val_loss', 'acc', 'val_acc'];
    const container = {
      name: 'show.fitCallbacks',
      tab: 'Training',
      styles: {
        height: '1000px'
      }
    };
    const callbacks = tfvis.show.fitCallbacks(container, metrics);
    return train(model, data, callbacks);
}

function load_learn(){
    optimizer.forEach(x => {
        $('#optimizer').append(
            $(`<option value="${x}">${x}</option>`)
        )
    })

    loss.forEach(x => {
        $('#losses').append(
            $(`<option value="${x}">${x}</option>`)
        )
    })
    
}



/*
const model_input = $("#model_input")

function getInputData() {
    input.forEach(x => {
        let idx = colname.indexOf(x)
        dataset.forEach(y => {

        })
    })
}

//var model = null

const load_model = () => {
    let file = model_input.files[0]
    let m_json = ""

    const fr = new FileReader()
    fr.onloadend = async () => {
        model = await tf.loadLayersModel("http://localhost/number_model.json")
        model.summary()
    }

    fr.readAsText(file, encoding="utf8")
}

const model_test = () => {
    model = tf.sequential()
    model.add(tf.layers.dense({units:2, inputShape:[2]}))
    model.add(tf.layers.dense({units:1, inputShape:[2], activation:"sigmoid"}))
    model.compile({loss: 'binaryCrossentropy', optimizer: 'sgd', metrics:['accuracy']});

    model.summary()
    test()
}

model_input.bind('change', () => load_model())

const fit = async () => {
    const history = await model.fit(tf.ones([8, 10]),
        tf.ones([8, 1]), {
        batchSize: 4,
        epochs: 3
    });
}

*/