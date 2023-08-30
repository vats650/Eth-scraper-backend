const fs = require('fs');
const dbHandle = require('./../db.js')
const utility = require('./../utility.js')
async function isDuplicateEntry(transactionHash){
    try{
        let selectQuery = "SELECT * FROM `onramp`.`ethTransactions` WHERE transactionHash = ?"
        let duplicateResult = await dbHandle.commonQuery(selectQuery, [transactionHash]);
        //console.log(duplicateResult, duplicateResult.length>0)
        if(duplicateResult.length>0)return true;
        else return false;
    }catch(ee){
        console.log('Error in isDuplicateEntry',ee);
    }
}   
//isDuplicateEntry('sdscc')

function removeCommas(str){
    try{
        let ans = '';
        for(let i=0;i<str.length;i++){
            if(str[i]!=',')
            ans+=str[i];
        }

        return ans;
    }catch(ee){
        console.log('Error in removeCommas',ee)
    }
}


async function dumpEntryInDB(rowData){
    try{
        let selectQuery = "SELECT * FROM `onramp`.`ethTransactions` WHERE transactionHash = ?"
        let duplicateResult = await dbHandle.commonQuery(selectQuery, [rowData['txn_hash']]);
        if(duplicateResult.length == 0){
        let insertQuery = "INSERT INTO `onramp`.`ethTransactions`  (transactionHash, txnMethod, block, age, fromAdress, toAdress, amount, asset) VALUES (?, ?, ?, ?, ?,?, ?, ?)";
        let resultQuery = await dbHandle.commonQuery(insertQuery, [rowData['txn_hash'], rowData['txn_method'], rowData['block'], rowData['age'], rowData['fromAdress'], rowData['toAdress'], removeCommas(rowData['amount']),
        rowData['asset']]);
        if(resultQuery.insertId){
            console.log('Succcess New Entry :)', rowData['txn_hash']);
            return true;
        }
        }

        return false;
    }catch(ee){
        console.log('Error in dumpEntryInDB',ee);
        return false;
    }
}

async function processDataToDb(data){
    try{
        await utility.asyncForEach(data, async (ind, rowData) => {
                await dumpEntryInDB(rowData);
        });
        
        return {success: true};
    }catch(ee){
        console.log('Error in processDataToDb',ee);
        return {success: false};
    }
}

async function readTransactionDump() {
    try{
        var firstFile = '';
        let files = fs.readdirSync('transactionDump');
        console.log(files);
        if (files.length === 0) {
            console.log('No sms files found in the folder.');return;
        }
        firstFile = files[0];
        //console.log({files});
        //console.log({firstFile});
        if(firstFile){
            const filePath = 'transactionDump/'+firstFile;
            let data = fs.readFileSync(filePath)
              console.log('File data:', data.length); // --> either delete it or move it to error_kes
              const response = await processDataToDb(JSON.parse(data),filePath);
              if(response.success){
                console.log('SUCCESS :)');
                await utility.delete_file(filePath);
              }else{
                await utility.moveFileToError(firstFile);
                let webhookToSend = `\`\`\`Error in Eth Scraping: ${firstFile}\`\`\``;
                await utility.sendDataToChat(webhookToSend, 'https://chat.googleapis.com/v1/spaces/AAAAqdFtwac/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=zZf6lW8oYY5YxiEr9fv9XnSVRBog4R3Y4WpNN674zws');
              }
        }

            return;//after processing 1st file
    }
    catch(ee){
        console.log('Error in reading SMS files',ee);
    }
};

let globLock = false;
setInterval(async () => {
  try{
    if(!globLock){
      globLock=true;
      await readTransactionDump();
      globLock=false;
    }
  }
  catch(err){
    globLock = false;
    console.log("Error in start ", err);
  }
}, 1*1000); 