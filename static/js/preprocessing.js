


var ohe_target = Array()
var ohe_dict = {}

var Trainset = null
var Testset  = null

var train_tensor = {x:null, y:null}
var test_tensor  = {x:null, y:null}

var sliced_dataset = Array()

function reviseDataset(idxArr, arr){
    dataset.forEach((x, i) => {
        x.forEach((_, j) => {
            let idx = idxArr.indexOf(j)
            if(idx != -1) {
                dataset[i][j] = arr[idx][i]
            }
        })
    })
}

function flatten(arr){
    let result = Array()
    arr.forEach(x => {
        x.forEach(y => {
            result.push(y)
        })
    })
    return result
}

function transpose(arr){
    let result = Array()
    arr[0].forEach(_ => {
        result.push(Array())
    })

    arr.forEach((x, i) => {
        x.forEach((y, j) => {
            result[j].push(y)
        })
    })

    return result
}

function uniqueDict(arr){
    let key = Array.from(new Set(arr))
    let result = {}
    key.forEach((x, i) => {
        result[x] = i
    })
    return result
}

function rtVerArr(idxArr, data){
    return data.map((x) => {
        return x.filter((_, j) => {
            return idxArr.indexOf(j) != -1
        })
    })
}

function ppString(idxArr) {
    let usetLst = {}
    let targetArr = rtVerArr(idxArr, dataset)
    let TtargetArr = transpose(targetArr)
    let result = TtargetArr.map((x, i) => {
        let uset = uniqueDict(x)
        usetLst[colname[idxArr[i]]] = uset
        return x.map(y => {
            return uset[y]
        })
    })
    reviseDataset(idxArr, result)
    return usetLst
}

function dataType(){
    return dataset[0].map(x => {
        return typeof(x)
    })
}

//==== type table

function typeTable() {
    setTarget()
    resetTable()
}

function resetTable(){
    $("#type_table").empty()

    var table = $('<table class="table table-striped"></table>')
    var head = datatableHead(colname)

    var body = $('<tbody id="dataType"></tbody>')
    
    dataType().forEach((x, i) => {
        let td = $(`<td>${String(x)}</td>`)
        if(ohe_target.includes(i)) { 
            td.attr('class', 'bg-warning')
        }
        td.click(function(){oheClick(this)})
        body.append(td)
    })

    table.append(head)
    table.append(body)

    $('#type_table').append(table)
}


function setTarget(){
    ohe_target = Array()
    dataType().map((x, i) => {
        if(x == 'string') ohe_target.push(i)
    })
}

function oheClick(e) {
    let idx = $(e).index()
    if(ohe_target.includes(idx)){
        ohe_target.splice(ohe_target.indexOf(idx), 1)
    }else {
        ohe_target.push(idx)
    }
    resetTable()
}

// ====


function doOHE() {
    let x = ppString(ohe_target)
    $('#ohe_result').text(JSON.stringify(x))
    typeTable()
}

const divideDataSet = () => {
    if(dataset.length == 0){
        alert("No DataSet!")
        return
    }
    let v = parseInt($('#train').val())
    let ratio = parseInt(dataset.length * (v/10))
    Trainset = dataset.slice(0, ratio)
    Testset = dataset.slice(ratio, dataset.length)
    $("#divide_result").html(`${Trainset.length} Train samples \n ${Testset.length} Test samples`)
}

function dataset_compile() {
    train_tensor.x = tf.tensor(rtVerArr(input, Trainset))
    test_tensor.x = tf.tensor(rtVerArr(input, Testset))


    let trt = flatten(rtVerArr(output, Testset))
    let tet = flatten(rtVerArr(output, Trainset))
    

    train_tensor.y = tf.oneHot(tf.tensor(trt, 'int32'), 3)
    test_tensor.y = tf.oneHot(tf.tensor(tet, 'int32'), 3)
}