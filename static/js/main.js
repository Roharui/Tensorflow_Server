
const fileinput = document.getElementById("fileinput")
const dataset = Array()

const Send = async () => {
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
          if(singleRow != 0) {
              x = parseFloat(x)
          }
          arr.push(x)
      }
      
      dataset.push(arr)
    }
}

function dataSetToTable() {
    var table = '<table>';
    table += '<thead>';
    table += '<tr>';
    dataset[0].forEach((x) => {
        table += '<th>'
        table += String(x)
        table += '</th>'
    })
    table += '</tr>'
    //for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    dataset.slice(1, 6).forEach(x => {
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
    document.getElementById('table').innerHTML += table;
}


fileinput.addEventListener('change', () => Send())