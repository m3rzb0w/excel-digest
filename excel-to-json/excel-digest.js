let selectedExcelFile;
let dataToSend;

const fileInput = document.querySelector("#file-box input[type=file]");

fileInput.onchange = () => {
    if (fileInput.files.length > 0) {
        const fileName = document.querySelector("#file-box .file-name");
        fileName.textContent = fileInput.files[0].name;
        selectedExcelFile = fileInput.files[0];
        if (selectedExcelFile && isExcelFile(selectedExcelFile)) {
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(selectedExcelFile);
            fileReader.onload = (event) => {
                let data = event.target.result;
                let excelFile = XLSX.read(data, { type: "binary" });
                excelFile.SheetNames.forEach(sheet => {
                    let rowObject = XLSX.utils.sheet_to_row_object_array(excelFile.Sheets[sheet]);
                    dataToSend = JSON.stringify(rowObject, undefined, 4)
                    document.getElementById("jsondata").innerHTML = dataToSend
                });
            };
            activateSendButton()
        } else {
            errorHelper();
        }
    }
};

const errorHelper = () => {
    const errorMessage = "Please input an Excel file..."
    const fileBox = document.querySelector("#file-box");
    const sendButton = document.querySelector("#send-button");
    fileBox.classList.remove("is-success")
    fileBox.classList.add("is-danger")
    sendButton.classList.remove("is-success")
    sendButton.disabled = true
    document.getElementById("jsondata").innerHTML = errorMessage
    console.error(`[error] ${errorMessage}`)
}

const isExcelFile = (file) => {
    const fileName = file.name.toLowerCase();
    return fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
}

const activateSendButton = () => {
    const sendButton = document.querySelector("#send-button")
    const fileBox = document.querySelector("#file-box");
    fileBox.classList.remove("is-danger")
    fileBox.classList.add("is-success")
    sendButton.classList.add("is-success")
    sendButton.disabled = false
}

const sendData = () => {
    // to do api call here
    if (dataToSend) {
        console.log(dataToSend);
        return
    }
    console.log("no data to send...")
}