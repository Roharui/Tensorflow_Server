
const download = {
    upload_server(){
        $.ajax({
            url : `/server_upload/${CODE}`,
            type : 'POST',
            success(data){
                console.log(data)
                d = JSON.parse(data)
                $('#pills-result').append($(`<p>${location.origin}/model/${d.code}</p>`))
            }
        })
    }
}