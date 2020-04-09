
const fileinput = document.getElementById("fileinput")

const Send = async () => {
    const files = fileinput.files;

    [...files].map(async (img) => {
        const data = new FormData();
        data.append('file', img);

        await fetch("/dataset", 
        {
            method : 'POST',
            body: data
        })
    })
}