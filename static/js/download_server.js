
const download = {
    upload_server(){
        $.ajax({
            url : `/server_upload/${CODE}`,
            type : 'POST',
            success(data){
                console.log(data)
                d = JSON.parse(data)
                console.log(d)
                $('#pills-result').append($(`<p>${d.code}</p>`))
            }
        })
    }
}