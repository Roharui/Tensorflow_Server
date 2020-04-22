
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

var firstLayer = () => {return {inputShape:[input.length], name:"INPUT", dtype:"float32"}}
var lastLayer  = () => {return {units:output.length, name:"OUTPUT"}}

function NameModel(){
    if($('#model-name').val() == ''){ alert("You Can't set model name as blank"); return}
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
        LayerArr.push([value, x])
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

function setLayer(){
    model = new tf.Sequential()
    LayerArr.forEach((layer) => {
        
        model.add(LayerType[layer[1]](layer[0]))
    })
    showLayer()
}

function modelSummary(){
    model.summary(undefined, undefined, function(x) {
        $('#summary_log').append(`<p>${x}</p>`)
    })
}

function showLayer(){
    $('#design_content').empty()
    //모델 시각화
    model.layers.forEach(x => {
        $('#design_content').append(
            layerAsType(x)
        )
    })
}

function delLayer(id){
    LayerArr = LayerArr.filter(x => id != x[0].name)
    setLayer()
    showLayer()
}

function hide_menu(){
    $('.tabcontent').hide()
}

function show_menu(x){
    hide_menu()
    $(`#${x}`).show()
}