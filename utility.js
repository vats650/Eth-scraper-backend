const fs = require('fs');
const https = require('https');

async function createFile(folderPath, fileName, content) {
    try{
        const filePath = folderPath+'/'+fileName;
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error('Error writing  in file:', err);
                return;
            }
            console.log(' written in file successfully');
        });
    }catch(ee){
        console.log('Error in createFile', ee);
    }
}

async function asyncForEach(array, callback) {
    for(var ele in array){
        await callback(ele, array[ele]);
    }
}

async function dumpDataToFiles(file_data){
    try{
        const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.txt`;
        await createFile('./transactionDump', fileName, file_data);
    }catch(ee){
        console.log('Error in dumpDataToFiles',ee);
    }
}

const delete_file = async function(absoluteFilePath) {
    try {
        await fs.promises.unlink(absoluteFilePath);
        console.log('File deleted successfully. ', absoluteFilePath);
    } catch (err) {
        console.error('Error deleting file:', err);
    }
};

const moveFileToError = async (filePath) => {
    try {
        const destinationFilePath = './transactionDumpError/'+filePath;
        await fs.promises.rename('./transactionDump/'+filePath, destinationFilePath);
        console.log('File moved successfully. ', './transactionDump/'+filePath, './transactionDumpError/'+filePath);
    } catch (err) {
        console.error('Error moving file:', err);
    }
};

async function sendDataToChat(dataToSend, webhookURL) {
    return new Promise((resolve, reject) => {
        try {
            const data = JSON.stringify({
                text: dataToSend,
            });
            
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            
            const req = https.request(webhookURL, options, (res) => {
                // Handle the response if needed
                // For example, you can log the response status code
                console.log('Response status code:', res.statusCode);
                
                // Resolve the promise once the request is complete
                return resolve('ok');
            });
            
            req.on('error', (error) => {
                console.error('Error in webhook Google Chat:', error);
                return reject(error);
            });
            
            req.write(data);
            req.end();
        } catch (error) {
            console.error('Error in webhook Google Chat:', error);
            return reject(error);
        }
    });
};

module.exports = {
    dumpDataToFiles,
    asyncForEach,
    delete_file,
    moveFileToError,
    sendDataToChat
}