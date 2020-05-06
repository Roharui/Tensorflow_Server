
const dataset = {
    cols : Array(),
    data : Array(),

    input  : Array(),
    output : Array(),

    reset(){
        this.cols   = Array()
        this.data   = Array()
        this.input  = Array()
        this.output = Array()
    },

    parseCsvToArray(result){
        this.reset()

        var allRows = result.split(/\r?\n|\r/);
        for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        const arr = Array()
        var rowCells = allRows[singleRow].split(',');
        for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
            let x = rowCells[rowCell]
            if(singleRow == 0) {
                this.cols.push(x)
            }
            else{
                x = parseFloat(x)
                if(isNaN(x)){ x = rowCells[rowCell] }
                arr.push(x)
            }
        }
            if(singleRow != 0)
            {
                this.data.push(arr)
            }
        }

        return `${dataset.data.length} rows ${dataset.cols.length} colums`
    },

    check_input(){
        this.input = $.map($('#x_input').find('input'), (x, num) => {
            return (x.checked?num:null)
        })
    },

    check_output(){
        this.output = $.map($('#y_output').find('input'), (x, num) => {
            return (x.checked?num:null)
        })
    }

}

const Table = {
    toTable(data, location) {
        location.empty()

        let table = $('<table class="table table-striped"></table>')

        var thead =  $('<thead class="thead-dark"></thead>')
        //colname.forEach((x) => {
        data.cols.forEach((x) => {
            thead.append($(`<th scope="col">${String(x)}</th>`))
        })

        table.append(thead)

        var tbody = $('<tbody></tbody>')

        data.data.slice(0, 5).forEach((x) => {
            let tr = $('<tr></tr>')
            x.forEach((y, i) => {
                tr.append($(`<td>${String(y)}</td>`))
            })
            tbody.append(tr)
        })

        table.append(tbody)

        location.append(table)
    }
}

const Send = async () => {

    const files = $("#fileinput")[0].files;

    const fr = new FileReader()

    fr.onloadend = () =>{
        let text = dataset.parseCsvToArray(fr.result)
        $('#dataset_info').text(text)

        Table.toTable(dataset, $('#table'))
        onload_inoutput()
    }

    fr.readAsText(files[0], encoding="utf8")
    
    /*
    [.map.files].map(async (file) => {
        const fr = new FileReader()

        fr.onloadend = () =>{
            parseCsvToArray(fr.result)
            dataSetToTable()
        }

        fr.readAsText(file, encoding="utf8")
    })
    */
    /*
    [...files].map(async (img) => {
        const data = new FormData();
        data.append('file', img);

        await fetch("/dataset", 
        {
            method : 'POST',
            body: data
        })
    })
    */
}

const onload_inoutput = () => {
    $('#input_content').empty()
    $('#output_content').empty()

    dataset.cols.forEach(x => {
        let con_x = $(`<label class="btn btn-primary"><input type="checkbox" value="${x}">${x}</label>`)
        let con_y = $(`<label class="btn btn-primary"><input type="checkbox" value="${x}">${x}</label>`)

        con_x.change(function(){dataset.check_input()})
        con_y.change(function(){dataset.check_output()})

        $('#input_content').append(con_x)
        $('#output_content').append(con_y)
    })
    
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}


function load() {

    $("#fileinput").change(function(){Send()})
    $('#train').change(function(){divide_ratio()})
    $('#enroll').click(function(){P.do()})

    view_P()
    
    ModelMaker.setButton()
    ModelMaker.AddButton()
    ModelMaker.setMenu('input')
    
    $("#train").val("8")
    divide_ratio()
}