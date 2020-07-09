

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
            let result = $('<select name="activation"></select>')
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
        if(ele.length == 0) {return null}
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
        else if(ele == ''){
            return ModelMaker.cur_type + "_" + String(ModelMaker.id)
        }
        return ele
    },
    "dtype" : (ele) => {
        return ele
    },
    "units" : (ele) => {
        if(Number(ele) == 0){
            alert("Unit Can't be Zero!")
            return 'Error'
        }
        return Number(ele)
    },
    "activation" : (ele) => {
        return ele
    }
}


const ModelMaker = {

    model : new tf.Sequential(),

    id : 0,
    al : -1,

    model_name : 'Model',

    LayerArr : Array(),

    cur_type : null,

    firstLayer : () => 
    {   
        if(P.pData.x.length == 0){ return null }
        return {inputShape:[P.pData.x[0].length], name:"INPUT", dtype:"float32", ltype : 'input', id: 'input'}
    },
    lastLayer  : () => 
    {
        if(P.pData.y.length == 0){ return null }
        return {units:P.pData.y[0].length, name:"OUTPUT", ltype : 'dense', id: 'output'} 
    },

    defaultName(){
        $('#model-name').val(this.model_name)
    },

    getLayer() {
        let inputs = $('#menu_content').find('input, select')
        let result = {id : this.id, ltype: this.cur_type}
        let go = true

        $.each(inputs, function (index, item) {
            let c = $(item)
            if(inputVal[c.attr('name')](c.val()) == 'Error'){
                go = false
            }
         })

         if(!go){ 
             return null
         }

        $.each(inputs, function (index, item) {  
            let c = $(item)
            let value = inputVal[c.attr('name')](c.val())
            if(value == null){return}
            result[c.attr('name')] = value
        })

        this.id ++

        return result
    },

    NameModel(){
        let name =  $('#model-name').val()
        if(name.length) return;
        this.model_name = name
    },

    setMenu(type){
        $('#menu_content').empty()
        this.cur_type = type

        let result = $(`<div>`)

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
            ModelMaker.LayerArr.push(ModelMaker.getLayer())
            ModelMaker.setMenu(ModelMaker.cur_type)
            ModelMaker.showLayer()
        })
        $('#design_controller').append(x)
    },

    AlterButton(){
        let x = $('<button class="btn">Alter</button>')
        x.click(function(){
            let l = ModelMaker.getLayer()
            l.id = ModelMaker.al
            ModelMaker.LayerArr = ModelMaker.LayerArr.map(x => {
                if(x.id == l.id){
                    return l
                }
                return x
            })
            ModelMaker.setMenu(ModelMaker.cur_type)
            ModelMaker.showLayer()
            $(this).remove()
        })
        $('#design_controller').append(x)
    },

    convertLayer(layer){
        return LayerType[layer.ltype](layer)
    },

    all_Layer() {
        let larr = [this.firstLayer()]

        this.LayerArr.forEach(x => {
            larr.push(x)
        })

        //larr.push(this.lastLayer())

        return larr.filter(x => {
            return x != null
        })
    },

    convert_all_layer(){
        return this.all_Layer().map(x => {
            let h = ModelMaker.convertLayer(x).getConfig()
            let hh = x.ltype
            return { 
                config : h,
                ltype : hh
            }
        })
    },

    async makeModel(){
        this.model = new tf.Sequential()
        this.model.name = this.model_name

        if(this.all_Layer().length == 0){
            alert("No Layers!")
            return;
        }

        try {
            this.all_Layer().map(x => {
                return this.convertLayer(x)
            }).forEach(x => {
                this.model.add(x)
            })
        }catch(e){
            console.log(e)
            alert(e.toString())
            return
        }

        if(USE_SERVER) {
            await this.model_send()
        }

        this.modelSummary()
        predict_load()
    },

    showLayer(){
        $('#design_content').empty()
        //모델 시각화
        this.all_Layer().forEach(x => {
            $('#design_content').append(
                layerAsType(x)
            )
        })
    },

    del(id){
        this.LayerArr = this.LayerArr.filter(x => {return x.id != id})
    },

    alter(id){
        let layer = this.LayerArr.filter(x => {return x.id == id})[0]
        this.al = layer.id
        this.setMenu(layer.ltype)
        this.AlterButton()

        for (let [key, value] of Object.entries(layer)) {
            $('#menu_content').find(`[name=${key}]`).val(value)
        }

    },

    modelSummary(){
        tfvis.show.modelSummary({ name: 'Model Summary', tab: 'Model Inspection'}, this.model)
    },

    async model_send(){
        await $.ajax({
            url : `/layers/${CODE}`,
            type : 'POST',
            contentType : 'application/json',
            data : JSON.stringify(ModelMaker.all_Layer()),
            success(data){
                alert('Successfuly send model to the Server')

                ModelMaker.modelSummary()
            }
        })
    }
}