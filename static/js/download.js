
const download = {
    download_json() {
        ModelMaker.model.save(`downloads://${ModelMaker.model_name}`)
    }
}