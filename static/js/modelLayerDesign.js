

function layerAsType(layer){
    let result = $('<div class="p-3 mb-2 bg-primary text-white"></div>')
    
    result.append($(`<h5>${layer.name}</h5>`))

    let revise = $('<button class="btn btn-warning">수정</button>')
    let del = $('<button class="btn btn-danger">X</button>')

    del.click((x) => delLayer(x.name))

    result.append(revise)
    result.append(del)

    return result
}
