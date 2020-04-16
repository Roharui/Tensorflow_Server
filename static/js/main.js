
var colname = Array()
var dataset = Array()

var Trainset = null
var Testset = null

const Send = async () => {
    $('#table').empty()
    dataset = Array()

    const files = $("#fileinput")[0].files;

    const fr = new FileReader()

    fr.onloadend = () =>{
        parseCsvToArray(fr.result)
        dataSetToTable()
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
    console.log($('#train').val())
    let v = parseInt($('#train').val())
    let ratio = parseInt(dataset.length * (v/10))
    Trainset = dataset.slice(1, ratio)
    TestSet = dataset.slice(ratio, dataset.length)
    $("#divide_result").html(`${Trainset.length} Train samples \n ${TestSet.length} Test samples`)
}


function load() {

    $("#fileinput").change(function(){Send()})
    $('#train').change(function(){divide_ratio()})
    $("#divide").click(function(){divideDataSet()})
    
    addTablink()
    addTabMenu()

    show_menu('input')
    
    $("#train").val("8")
    divide_ratio()

}

$(document).ready(function(){
    load()
})