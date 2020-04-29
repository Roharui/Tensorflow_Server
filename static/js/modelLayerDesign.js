

function layerAsType(layer, num){
    let result = $('<div class="p-3 mb-2 bg-primary text-white"></div>')
    
    result.append($(`<h5>${layer.name}</h5>`))

    if(layer.name == 'INPUT' || layer.name == "OUTPUT")
    {
        result.attr('class', "p-3 mb-2 bg-success text-white")
        return result
    }

    result.click(function(){setStartLoc(this)})

    let del = $(`<button class="btn btn-danger">X</button>`)

    del.click(function(){delLayer(this)})

    result.append(del)

    return result
}

function setStartLoc(e){
    //warning
    e = $(e)

    clearStartLoc()
    if(addLoc == e.index()){
        addLoc = -1
        return
    }
    addLoc = e.index()
    e.attr('class', "p-3 mb-2 bg-warning text-white")
}

function clearStartLoc(){
    let div = $('#design_content').find('div')

    for(var i = 0; i < div.length; i++){
        let j = $(div[i])
        if(j.html() == 'INPUT' || j.html() == "OUTPUT")
        {
            j.attr('class', "p-3 mb-2 bg-success text-white")
        }
        else{
            j.attr('class', "p-3 mb-2 bg-primary text-white")
        }
    }
}