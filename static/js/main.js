
var colname = Array()
var dataset = Array()

var input  = Array()
var output = Array()

const Send = async () => {
    dataset = Array()
    colname = Array()

    const files = $("#fileinput")[0].files;

    const fr = new FileReader()

    fr.onloadend = () =>{
        parseCsvToArray(fr.result)
        dataset = shuffle(dataset)
        set_all_table()
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

const set_all_table = () => {
    $('.table').empty()

    $("#table").append(dataSetToTable(colname));
    onload_inoutput()
    typeTable()

}

const parseCsvToArray = (data) => {
    var allRows = data.split(/\r?\n|\r/);
    for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
      const arr = Array()
      var rowCells = allRows[singleRow].split(',');
      for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
          let x = rowCells[rowCell]
          if(singleRow == 0) {
              colname.push(x)
          }
          else{
            x = parseFloat(x)
            if(isNaN(x)){ x = rowCells[rowCell] }
            arr.push(x)
          }
      }
      if(singleRow != 0)
      {
        dataset.push(arr)
      }
    }

    $('#dataset_info').text(`${dataset.length} rows ${colname.length} colums`)
}

function dataSetToTable(cols) {

    var table = $('<table class="table table-striped"></table>')

    var head = datatableHead(cols)
    var body = datatableBody(cols)

    table.append(head)
    table.append(body)
    
    return table
}

function datatableHead(cols){

    var thead =  $('<thead class="thead-dark"></thead>')
    //colname.forEach((x) => {
    cols.forEach((x) => {
        thead.append($(`<th scope="col">${String(x)}</th>`))
    })

    return thead
}

function datatableBody(cols){

    var tbody = $('<tbody></tbody>')

    let mask = colsToIdxArr(cols)

    dataset.slice(0, 5).forEach((x) => {
        let tr = $('<tr></tr>')
        x.forEach((y, i) => {
            if(mask[i]){
                tr.append($(`<td>${String(y)}</td>`))
            }
        })
        tbody.append(tr)
    })

    return tbody
}

const colsToIdxArr = (cols) => {
    return colname.map((x) => {
        return (cols.indexOf(x) > -1)
    })
}

const divide_ratio = () => {
    let v = parseInt($('#train').val())
    $('#test').val(String(10 - v))
}

const onload_inoutput = () => {
    $('#input_content').empty()
    $('#output_content').empty()

    colname.forEach(x => {
        let con_x = $(`<label class="btn btn-primary"><input type="checkbox" value="${x}">${x}</label>`)
        let con_y = $(`<label class="btn btn-primary"><input type="checkbox" value="${x}">${x}</label>`)

        con_x.change(function(){check_input(this)})
        con_y.change(function(){check_output(this)})

        $('#input_content').append(con_x)
        $('#output_content').append(con_y)
    })
    
}

const check_input = (e) => {
    let idx = $(e).index()
    if(input.includes(idx)){
        input.splice(input.indexOf(idx), 1)
    }else {
        input.push(idx)
    }
    setLayer()
}

const check_output = (e) => {
    let idx = $(e).index()
    if(output.includes(idx)){
        output.splice(output.indexOf(idx), 1)
    }else {
        output.push(idx)
    }
    setLayer()
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
    $("#divide").click(function(){divideDataSet()})
    
    setNamingModel()
    addTablink()
    addTabMenu()

    show_menu('input')
    
    $("#train").val("8")
    divide_ratio()

    $("#ohe").click(function(){doOHE()})
}