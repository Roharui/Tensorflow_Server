
var model = new tf.Sequential()

const LayerType = {
    "input" : tf.layers.inputLayer,
    "dense" : tf.layers.dense
}
const menuArr = {
    "input" : 
    {
        inputShape: ['shape', (x) => {return x}],
        name : ['string', (x) => {return x}],
        dtype: ['enum', (x) => {return x}]
    },
    "dense" :
    {
        units: ['int', (x) => {return x}],
        name : ['string', (x) => {return x}],
        activation : ['enum', (x) => {return x}],
        inputShape: ['shape', (x) => {return x}]
    }
    
}

const LayerArr = Array()

/*
<div id="input_menu" class="tabcontent">
input_menu
<button class='add'>추가하기</button>
</div>
<div id="dense_menu" class="tabcontent">
dense_menu
<button class='add'>추가하기</button>
</div>
*/

function addTablink(){
    //탭 버튼
    Object.keys(LayerType).forEach(x => {
        let div = $(`<button class="tablink">${x}</button>`)

        //div.setAttribute('id', x)
        div.click(function(){show_menu(x)})

        $('#tab').append(div)
    })
}

function addTabMenu(){
    //메뉴 div
    Object.keys(menuArr).forEach(x => {
        console.log(x)
        let div = $(`<div id=${x} class="tabcontent" style="display: none;"></div>`)
        let content = getMenuContent(menuArr[x])

        let btn = $('<button>ADD</button>')
        btn.click(function(){

        })

        div.append(content)
        div.append(btn)

        console.log(div.html())

        $('#menu_content').append(div)
    })
}

function getMenuContent(param_type){
    //메뉴 콘텐츠
    let div = $('<div></div>')

    Object.keys(param_type).forEach(x => {
        let value = param_type[x]
        let span = $(`<span>${x} : </span>`)
        let input_box = getInputType(null)
        
        span.append(input_box)

        div.append(span)
    });

    return div
}

function getInputType(type){
    return $('<input type="text"></input>')
}

function addLayer(layer, type){
    model.add(type(layer))
    LayerArr.add(layer)
}

function showLayer(){
    $('#design_content').empty()
    //모델 시각화
    LayerArr.forEach(x => {
        $('#design_content').append(
            $(`<div>${x.name}</div>`)
        )
    })
}

function hide_menu(){
    $('.tabcontent').hide()
}

function show_menu(x){
    hide_menu()
    $(`#${x}`).show()
}