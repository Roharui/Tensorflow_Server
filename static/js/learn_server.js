

const loss = [
    'mean_squared_error',
    'mean_absolute_error',
    'mean_absolute_percentage_error',
    'mean_squared_logarithmic_error',
    'squared_hinge',
    'hinge',
    'categorical_hinge',
    'logcosh',
    'categorical_crossentropy',
    'sparse_categorical_crossentropy',
    'binary_crossentropy',
    'kullback_leibler_divergence',
    'poisson'
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

String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

const Learn = {
    compile(){
        $.ajax({
            url : `/compile/${CODE}`,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify({
                optimizer: $('#optimizer').val(), 
                loss: $('#losses').val(),
                metrics: ["acc"]
            }),
            success(){
                alert('Success!')
            }
        })
    },

    async fit(){
        const container = {
            name: 'show.histroy',
            tab: 'Training'
        }
        await $.ajax({
            url : `/fit/${CODE}`,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify({
                batch_size : parseInt($('#batch_size').val()),
                epochs : parseInt($('#epoch').val()),
            }),
            success(data){
                let d = JSON.parse(data)
                d = d.replaceAll("'", '"')
                d = d.replaceAll("False", "false")
                d = JSON.parse(d)
                console.log(d)
                tfvis.show.history(container, d, d['params']['metrics'])
                alert('Success!')
            }
        })
    },

    async predict(){
        let result = []
        dataset.input.forEach(x => {
            result.push(parseFloat($('#prd_' + x).val()))
        })

        let tns = Array(result)

        var realResult;

        await $.ajax({
            url : `/predict/${CODE}`,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify({
                data : tns
            }),
            success(data){
                realResult = JSON.parse(JSON.parse(data))
            }
        })

        if(P.usetLst.length != 0){
            let dict = P.usetLst.map(x => {
                let tmp = {}
                Object.keys(x).forEach(y => {
                    tmp[x[y]] = y
                })
                return tmp
            })

            let xx = dict.map((x, i) => {
                console.log(realResult[i])
                return x[realResult[i]]
            })
            $('#predict_result').text(xx)

        }
        else{
            $('#predict_result').text(realResult)
        }
    },

    async evaluate() {
        $('#test_result').empty()

        let result;

        await $.ajax({
            url : `/evaluate/${CODE}`,
            type : 'POST',
            success(data){
                result = JSON.parse(JSON.parse(data))
            }
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