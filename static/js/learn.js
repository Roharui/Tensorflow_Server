

const model_input = $("#model_input")

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

