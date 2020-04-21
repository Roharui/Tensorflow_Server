

function layerAsType(layer){
    result = $('<div></div>')
    
    result.append($(`<h5>${layer.name}</h5>`))

    return result
}