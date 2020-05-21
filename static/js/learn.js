

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
        ModelMaker.model.compile(
            {
                optimizer: $('#optimizer').val(), 
                loss: $('#losses').val(),
                metrics: ["acc"]
            }
        )
    },

    async fit(){
        tfvis.visor().open()
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
                batch_size : parseInt($('#batch_size').val()),
                epochs : parseInt($('#epoch').val()),
                callbacks: callbacks
            }
        )
    },

    predict(){
        let result = []
        dataset.input.forEach(x => {
            result.push(parseFloat($('#prd_' + x).val()))
        })

        let tns = tf.tensor(Array(result))

        var realResult = ModelMaker.model.predict(tns).argMax(1).arraySync()

        if(P.usetLst.length != 0){
            let dict = P.usetLst.map(x => {
                let tmp = {}
                Object.keys(x).forEach(y => {
                    tmp[x[y]] = y
                })
                return tmp
            })

            let xx = dict.map((x, i) => {
                return x[realResult[i]]
            })
            console.log(dict)
            console.log(realResult)
            $('#predict_result').text(xx)

        }
        else{
            $('#predict_result').text(realResult)
        }
    },

    evaluate() {
        $('#test_result').empty()

        let scalas = ModelMaker.model.evaluate(P.tensor.test.x, P.tensor.test.y, {
            batchSize: 4,
        });

        let result = scalas.map(x => {
            return x.dataSync()
        })

        let data = {
            cols : ['loss', 'accuracy'],
            data : Array(result)
        }

        Table.toTable(data, $('#test_result'))

    }

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

    $('#model_compile_btn').click(function(){ Learn.compile()})
    $('#model_fit_btn').click(function(){ Learn.fit()})
    $('#predict').click(function(){ Learn.predict() })
    $('#random_row').click(function(){ getRandomRow() })
    $('#evaluate').click(function(){ Learn.evaluate() })
    
}

function predict_load(){
    let data = {
        cols : dataset.input.map(x => {
            return dataset.cols[x]
        }),
        data : dataset.input.map(x => {
            return $('<input/>', {type: 'text', id:'prd_' + x})
        })
    }

    Table.toTAbleEX(data, $('#prdict_random_table'))
}

function getRandomRow(){
    $('#prdict_random_table_result').empty()

    let data = {
        cols : dataset.cols,
        data : Array(dataset.data[Math.floor(Math.random() * dataset.data.length)])
    }

    Table.toTable(data, $('#prdict_random_table_result'))
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