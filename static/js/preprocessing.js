
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

function rtVerArr(idxArr){
    return dataset.map((x) => {
        return x.filter((_, j) => {
            return idxArr.indexOf(j) != -1
        })
    })
}

function ppString(idxArr) {
    let usetLst = Array()
    let targetArr = rtVerArr(idxArr)
    let TtargetArr = transpose(targetArr)
    let result = TtargetArr.map(x => {
        let uset = uniqueDict(x)
        usetLst.push(uset)
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

function typeTable(){
    var table = $('<table class="table table-striped"></table>')
    var head = datatableHead(colname)

    var body = $('<tbody></tbody>')
    
    dataType().forEach(x => {
        body.append($(`<td>${String(x)}</td>`))
    })

    table.append(head)
    table.append(body)

    $('#type_table').append(table)
}
