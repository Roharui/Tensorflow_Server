
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
        html : () => $('<select name="dtype"></select>'),
        option : ['float32','int32','bool','complex64','string']
    },
    "units" : {
        html : () =>  $('<input/>', {type: 'number', name: 'units', class:'form-control'})
    },
    "activation" : {
        html : () =>  $('<select name="activation"></select>'),
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

var LayerArr = Array()
var addLoc = -1

var firstLayer = () => 
{   
    return { layer : {inputShape:[input.length], name:"INPUT", dtype:"float32"}, type : 'input'}
}
var lastLayer  = () => 
{
    return { layer : {units:output.length, name:"OUTPUT"}, type : 'dense'} 
}

function NameModel(){
    if($('#model-name').val() == ''){ return}
    model.name = $('#model-name').val()   
}

function addTablink(){
    //탭 버튼
    Object.keys(LayerType).forEach(x => {
        let div = $(`<button type="button" class="list-group-item list-group-item-action">${x}</button>`)

        //div.setAttribute('id', x)
        div.click(function(){show_menu(x)})

        $('#tab').append(div)
    })
}

function setNamingModel(){
    $('#set-model-name').click(() => {NameModel()})
}

function addTabMenu(){
    //메뉴 div
    Object.keys(menuArr).forEach(x => {

        let div = TabMenuContent(x)

        //console.log(div.html())

        $('#menu_content').append(div)
    })
}

function TabMenuContent(x){
    let div = $(`<div id=${x} class="tabcontent" style="display: none;"></div>`)
    let content = getMenuContent(menuArr[x])

    let btn = $('<button class="btn">ADD</button>')
    btn.click(function(){
        let value = getInputVal(this)
        addLayer(value, x)
        setLayer()
    })

    div.append(content)
    div.append(btn)

    return div
}

function getMenuContent(param_type){
    //메뉴 콘텐츠
    let div = $('<div class="input-group mb-3"></div>')

    param_type.forEach(x => {
        let span = $(`<span>${x} : </span>`)
        let input_box = getInputTag(x)
        
        span.append(input_box)
        
        div.append(span)
    });

    return div
}

function getInputTag(x){
    let result = inputTag[x].html()
    if(inputTag[x].option){
        inputTag[x].option.forEach(y => {
            result.append($(`<option value='${y}'>${y}</option>`))
        })
    }
    return result
}

function getInputVal(btn){
    let result = {}

    let input = $(btn).parent().find('input, select')

    //console.log(input)

    for(var i = 0; i < input.length; i++)
    {
        let c = $(input[i])
        if(c.val() == ''){continue}
        let value = inputVal[c.attr('name')](c.val())
        if(value == "Error"){ continue }
        result[c.attr('name')] = value
    }

    return result
}

function addLayer(layerx, typex){
    let result = { layer : layerx,
                    type : typex}

    if(addLoc == -1){
        LayerArr.push(result)
        return
    }

    LayerArr.splice(addLoc + 1, 0, result)
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
    console.log(id)
    id = parseInt($(id).parent().attr('xid'))
    LayerArr.splice(id, 1)
    setLayer()
    showLayer()
}


function reviseLayer(id){

}

function hide_menu(){
    $('.tabcontent').hide()
}

function show_menu(x){
    hide_menu()
    $(`#${x}`).show()
}