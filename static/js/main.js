

const fileinput = element_id("fileinput")
const trainCount = element_id('train')
const testCount = element_id('test')
const dataset_result = element_id('divide_result')

var colname = Array()
var dataset = Array()

var Trainset = null
var Testset = null


const Send = async () => {
    table.innerHTML = ""
    dataset = Array()

    const files = fileinput.files;

    [...files].map(async (file) => {
        const fr = new FileReader()

        fr.onloadend = () =>{
            parseCsvToArray(fr.result)
            dataSetToTable()
        }

        fr.readAsText(file, encoding="utf8")
    })

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
    var table = '<table>';
    table += '<thead>';
    table += '<tr>';
    colname.forEach((x) => {
        table += '<th>'
        table += String(x)
        table += '</th>'
    })
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
    element_id('table').innerHTML += table;
}

const divide_ratio = () => {
    let v = parseInt(trainCount.value)
    testCount.value = String(10 - v)
}

const divideDataSet = () => {
    let v = parseInt(trainCount.value)
    let ratio = parseInt(dataset.length * (v/10))
    console.log(ratio)
    Trainset = dataset.slice(1, ratio)
    TestSet = dataset.slice(ratio, dataset.length)
    element_id('divide_result').innerHTML = `${Trainset.length} Train samples \n ${TestSet.length} Test samples`
}

var t = Array()
var ty = Array()

function test()
{
    for(var i=0; i < 100; i++){
        t.push(dataset[i].slice(1,3))
    }

    for(var i=0; i < 100; i++){
        if(dataset[i][5] == 'setosa')
        {
            ty.push(1)
        }else{
            ty.push(0)
        }
    }
}

element_id('divide').addEventListener('click', () => divideDataSet())
fileinput.addEventListener('change', () => Send())
trainCount.addEventListener('change', () => divide_ratio())

trainCount.value = "8"
divide_ratio()