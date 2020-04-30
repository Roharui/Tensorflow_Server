


const P = {
    dataset : dataset,

    pData : {
        x : Array(),
        y : Array()
    },

    usetLst : Array(),

    OHE : true,

    tensor : null,

    complie() {

        let v = parseInt($('#train').val())
        let ratio = parseInt(this.dataset.data.length * (v/10))

        let tr_x = this.pData.x.slice(0, ratio)
        let te_x = this.pData.x.slice(ratio, dataset.length)

        let tr_y = this.pData.y.slice(0, ratio)
        let te_y = this.pData.y.slice(ratio, dataset.length)

        $("#divide_result").html(`${tr_x.length} Train samples \n ${te_x.length} Test samples`)

        this.tensor =  {
            train : {
                x : tf.tensor(tr_x),
                y : tf.tensor(tr_y)
            },

            test : {
                x : tf.tensor(te_x),
                y : tf.tensor(te_y)
            }
        }
    },

    toXY(){
        let i = this.dataset.input
        let o = this.dataset.output

        let data = this.transpose(this.dataset.data)

        let _x = this.transpose(i.map((num) => {
            return data[num]
        }))

        let _y = this.transpose(o.map((num) => {
            return data[num]
        }))

        return  {
            x : _x,
            y : _y
        }
    },

    transpose(data){
        if(data.length == 0){ return null }

        let result = Array()
        data[0].forEach(_ => {
            result.push(Array())
        })
    
        data.forEach((x, i) => {
            x.forEach((y, j) => {
                result[j].push(y)
            })
        })
        return result
    },

    ohe(){

        let y = this.pData.y

        data = this.transpose(y)[0]

        let {uset, len} = this.getUset(data)
        this.usetLst.push(uset)

        let result = data.map(x => {
            return this.ohe_arr(uset[x], len)
        })

        this.pData.y = result
    },

    ohe_arr(x, len){
        let result = Array()

        for(let i=0;i<len;i++){
            result.push((x == i ? 1 : 0))
        }
        return result
    },

    getUset(data){
        let key = Array.from(new Set(data))
        let result = {}
        key.forEach((x, i) => {
            result[x] = i
        })
        return {uset:result, len:key.length}
    },

    divideDataSet(){
        let dataset = this.dataset.data
        if(dataset.length == 0){
            alert("No DataSet!")
            return
        }
        let v = parseInt($('#train').val())
        let ratio = parseInt(dataset.length * (v/10))
    
        //this.trainSet = dataset.slice(0, ratio)
        //this.testSet = dataset.slice(ratio, dataset.length)
    
        //$("#divide_result").html(`${this.trainSet.length} Train samples \n ${this.testSet.length} Test samples`)
    },

    do(){
        this.pData = this.toXY()
    }
    
}

//==== type table

function typeTable(){

    let table_data = {
        cols : dataset.input.map(x => {
            return dataset.cols[x]
        }),
        data : Array(P.pData.x[0].map((x) => {
            return typeof(x)
        })),
    }

    Table.toTable(table_data, $('#in_type_table'))

    table_data = {
        cols : dataset.output.map(x => {
            return dataset.cols[x]
        }),
        data : Array(P.pData.y[0].map((x) => {
            return typeof(x)
        })),
    }

    Table.toTable(table_data, $('#out_type_table'))
}

// ====

const divide_ratio = () => {
    let v = parseInt($('#train').val())
    $('#test').val(String(10 - v))
}

function dataset_compile() {
    train_tensor.x = tf.tensor(rtVerArr(input, Trainset))
    test_tensor.x = tf.tensor(rtVerArr(input, Testset))


    let trt = flatten(rtVerArr(output, Testset))
    let tet = flatten(rtVerArr(output, Trainset))
    

    train_tensor.y = tf.oneHot(tf.tensor(trt, 'int32'), 3)
    test_tensor.y = tf.oneHot(tf.tensor(tet, 'int32'), 3)
}

function view_P(){
    $("#divide").click(function(){P.complie()})
    $('#see_table').click(function(){typeTable()})
    $('#ohe').click(function(){P.ohe()})
}