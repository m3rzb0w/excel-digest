let selectedExcelFile;
let dataToSend;

const fileInput = document.querySelector("#file-box input[type=file]");

fileInput.addEventListener("change", async () => {
    if (fileInput.files.length > 0) {
        const fileNameElement = document.querySelector("#file-box .file-name");
        fileNameElement.textContent = fileInput.files[0].name;
        selectedExcelFile = fileInput.files[0];

        if (selectedExcelFile && isExcelFile(selectedExcelFile)) {
            try {
                const data = await readFileAsArrayBuffer(selectedExcelFile);
                const workBook = XLSX.read(data, { type: "array" });
                const sheetNameToUse = workBook.SheetNames[0];
                const workSheet = workBook.Sheets[sheetNameToUse];
                const workSheetData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
                
                if (fileHeadersAndLengthCheck(workSheetData)) {
                    const rowObject = XLSX.utils.sheet_to_json(workSheet);
                    dataToSend = JSON.stringify(rowObject, undefined, 4);
                    document.getElementById("jsondata").textContent = dataToSend;
                    activateSendButton();
                } else {
                    showError("File format is incorrect or too many rows.");
                }
            } catch (error) {
                showError("An error occurred while reading the file.");
                console.error(`[error] ${error.message}`);
            }
        } else {
            showError("Please input a valid Excel file...");
        }
    }
});

const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => resolve(event.target.result);
        fileReader.onerror = (error) => reject(error);
        fileReader.readAsArrayBuffer(file);
    });
};

const isExcelFile = (file) => {
    const fileName = file.name.toLowerCase();
    return fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
};

const fileHeadersAndLengthCheck = (workSheetData) => {
    const maxFileRows = 1000;
    const requestedHeaders = ["ean", "sku", "name", "designation"];
    
    if (workSheetData.length > maxFileRows) {
        return false;
    }

    if (requestedHeaders.length !== workSheetData[0].length) {
        return false;
    }

    return workSheetData[0].every((value, index) => value.toLowerCase() === requestedHeaders[index].toLowerCase());
};

const showError = (message) => {
    const fileBox = document.querySelector("#file-box");
    const sendButton = document.querySelector("#send-button");

    fileBox.classList.remove("is-success");
    fileBox.classList.add("is-danger");
    sendButton.classList.remove("is-success");
    sendButton.disabled = true;

    document.getElementById("jsondata").textContent = message;
    console.error(`[error] ${message}`);
};

const activateSendButton = () => {
    const sendButton = document.querySelector("#send-button");
    const fileBox = document.querySelector("#file-box");

    fileBox.classList.remove("is-danger");
    fileBox.classList.add("is-success");
    sendButton.classList.add("is-success");
    sendButton.disabled = false;
};

const sendData = () => {
    // Placeholder for API call
    if (dataToSend) {
        console.log(dataToSend);
    } else {
        console.log("No data to send...");
    }
};