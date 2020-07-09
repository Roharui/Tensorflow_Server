

const download = {
    download_json() {
        ModelMaker.model.save(`downloads://${ModelMaker.model_name}`)
        
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(P.usetLst));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href",     dataStr     );
        dlAnchorElem.setAttribute("download", "scene.json");
        dlAnchorElem.click();
    }
}