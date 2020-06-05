
const download = {
    download_json() {
        ModelMaker.model.save(`downloads://${ModelMaker.model_name}`)
    },

    async send_to_server(){

        await ModelMaker.model.save('http://localhost/upload')

    }
    
}