
function layerAsType(layer){
    console.log(layer)
    let result = $('<div class="p-3 mb-2 bg-primary text-white"></div>')
    result.attr('xid', layer.id)
    
    result.append($(`<h5>${layer.name}</h5>`))

    if(layer.id == 'input' || layer.id == 'output')
    {
        result.attr('class', "p-3 mb-2 bg-success text-white")
        return result
    }

    let del = $(`<button class="btn btn-danger">X</button>`)

    del.click(function(){delLayer(this)})

    let alter = $(`<button class="btn btn-danger">Alter</button>`)

    alter.click(function(){alterLayer(this)})

    result.append(del)
    result.append(alter)

    return result
}

function delLayer(e){
    //warning
    e = $(e).parent()

    ModelMaker.del(e.attr('xid'))
    ModelMaker.showLayer()
}

function alterLayer(e){
    //warning
    e = $(e).parent()

    ModelMaker.alter(e.attr('xid'))
    ModelMaker.showLayer()
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