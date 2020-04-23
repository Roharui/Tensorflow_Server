
var colname = Array()
var dataset = Array()

var Trainset = null
var Testset = null

var input = Array()
var output = Array()

const Send = async () => {
    $('#table').empty()
    dataset = Array()
    colname = Array()

    const files = $("#fileinput")[0].files;

    const fr = new FileReader()

    fr.onloadend = () =>{
        parseCsvToArray(fr.result)
        dataset = shuffle(dataset)
        dataSetToTable()
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

function dataSetToTable() {
    var table = '<table class="table table-striped">';
    table += '<thead class="thead-dark">';
    table += '<tr>';
    colname.forEach((x) => {
        table += '<th scope="col">'
        table += String(x)
        table += '</th>'
    })
    table += '</thead>'
    table += '<tbody>'
    table += '</tr>'
    dataset.slice(0, 5).forEach(x => {
        table += '<tr>';
        x.forEach(y => {
            table += '<td>'
            table += String(y)
            table += '</td>'
        })
        table += '</tr>'
    })

    table += '</tr>';
    table += '</tbody>';
    table += '</table>';

    $("#table").html(table);
}

const divide_ratio = () => {
    let v = parseInt($('#train').val())
    $('#test').val(String(10 - v))
}

const divideDataSet = () => {
    if(dataset.length == 0){
        alert("No DataSet!")
        return
    }
    let v = parseInt($('#train').val())
    let ratio = parseInt(dataset.length * (v/10))
    Trainset = dataset.slice(0, ratio)
    TestSet = dataset.slice(ratio, dataset.length)
    $("#divide_result").html(`${Trainset.length} Train samples \n ${TestSet.length} Test samples`)
}

const onload_inoutput = () => {
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
    let x = $(e).parent().find("input").toArray().filter(s => {
        return s.checked
    })

    input = x.map(s => {
        return s.value
    })
    setLayer()
}

const check_output = (e) => {
    let x = $(e).parent().find("input").toArray().filter(s => {
        return s.checked
    })

    output = x.map(s => {
        return s.value
    })
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
}