
var model = new tf.Sequential()

const LayerType = {
    "input" : tf.layers.inputLayer,
    "dense" : tf.layers.dense
}

const menuArr = {
    "input" : 
    [
        'inputShape',
        'name',
        'dtype'
    ],
    "dense" :
    [
        'units',
        'name',
        'activation',
        'inputShape'
    ]
}

const inputTag = {

    "inputShape" : {
        html : () => $('<input/>', {type: 'text', name: 'inputShape', class:'form-control'}),
    },
    
    "name" : {
        html : () => $('<input/>', {type: 'text', name: 'name', class:'form-control'})
    },

    "dtype" : {
        html() {
            let result = $('<select name="dtype"></select>')
            this.option.forEach(x => {
                result.append($(`<option value='${x}'>${x}</option>`))
            })

            return result
        },
        option : ['float32','int32','bool','complex64','string']
    },

    "units" : {
        html : () =>  $('<input/>', {type: 'number', name: 'units', class:'form-control'})
    },

    "activation" : {
        html() {
            let result = $('<select name="dtype"></select>')
            this.option.forEach(x => {
                result.append($(`<option value='${x}'>${x}</option>`))
            })

            return result
        },
        option : ['elu','hardSigmoid','linear','relu','relu6', 'selu','sigmoid','softmax','softplus','softsign','tanh']
    }
}

const inputVal = {
    "inputShape" : (ele) => {
        let result = []
        ele.split(', ').forEach(x => {
            if(x == 'null'){
                result.push(null)
            }
            else{
                result.push(Number(x))
            }
        })
        return result
    },
    "name" : (ele) => {
        if(ele.indexOf(' ') >= 0){
            alert("You Can't insert Blank Space in Name")
            return "Error"
        }
        return ele
    },
    "dtype" : (ele) => {
        return ele
    },
    "units" : (ele) => {
        return Number(ele)
    },
    "activation" : (ele) => {
        return ele
    }
}


const ModelMaker = {

    data : P.pData,

    input_Layer  : null,
    output_Layer : null,

    model_name : 'Model',

    LayerArr : Array(),

    firstLayer : () => 
    {   
        return { layer : {inputShape:[input.length], name:"INPUT", dtype:"float32"}, type : 'input'}
    },
    lastLayer  : () => 
    {
        return { layer : {units:output.length, name:"OUTPUT"}, type : 'dense'} 
    },

    getLayer() {
        let inputs = $('#menu_content').find('input, select')
        let result = {}
        let go = true

        $.each(inputs, function (index, item) {
            let c = $(item)
            go = inputVal[c.attr('name')](c.val()) != 'Error'
         })

         if(!go){ 
             return null
         }

        $.each(inputs, function (index, item) {  
            let c = $(item)
            if(c.val().length == 0){return}
            result[c.attr('name')] = inputVal[c.attr('name')](c.val())
        })

        return result
    },

    NameModel(){
        let name =  $('#model-name').val()
        if(name.length) return;
        this.model_name = name
    },

    setMenu(type){
        $('#menu_content').empty()

        let result = $('<div>')

        menuArr[type].map(x => {
            result.append(
                $(`<div>${x} : </div>`).append(
                    inputTag[x].html()
                )
            )
        })

        $('#menu_content').append(result)
    },

    setButton(){
        let tab = $('#tab')
        Object.keys(menuArr).forEach(x => {
            let btn = $(`<button name="${x}" class="btn">${x}</button>`)
            btn.click(function(){
                let name = $(this).attr('name')
                ModelMaker.setMenu(name)
            })
            tab.append(btn)
        })
    },

    AddButton(){
        let x = $('<button class="btn">ADD</button>')
        x.click(function(){
            console.log(ModelMaker.getLayer())
        })
        $('#design_controller').append(x)
    }

}


var LayerArr = Array()
var addLoc = -1


function setNamingModel(){
    $('#set-model-name').click(() => {NameModel()})
}

function addLayer(layerx, typex){
    let result = { layer : layerx,
                    type : typex}

    if(addLoc == -1){
        LayerArr.push(result)
        return
    }

    LayerArr.splice(addLoc, 0, result)
}

function setLayer(){
    model = new tf.Sequential()
    NameModel()

    let x = firstLayer()
    let y = lastLayer()

    if(input.length != 0){
        model.add(LayerType[x.type](x.layer))
    }
    
    LayerArr.forEach((i) => {
        model.add(LayerType[i.type](i.layer))
    })

    if(output.length != 0)
    {
        model.add(LayerType[y.type](y.layer))
    }

    $('#model-name').val()
    showLayer()
}

function modelSummary(){
    $('#summary_log').empty()
    model.summary(undefined, undefined, function(x) {
        $('#summary_log').append(`<p class="text-center">${x}</p>`)
    })
}

function showLayer(){
    let num = 0
    if(input.length != 0){
        num --
    }
    $('#design_content').empty()
    //모델 시각화
    model.layers.forEach(x => {
        $('#design_content').append(
            layerAsType(x, num)
        )
        num ++
    })
}

function delLayer(id){
    id = $(id).index() - 1
    console.log(id)
    LayerArr.splice(id, 1)
    setLayer()
    showLayer()
}