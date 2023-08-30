// server.js
const cors = require('cors'); 
const express = require('express');

const app = express();
const port = 9010;
app.use(cors());
const utility = require('./utility.js')

app.use(express.json()); // Middleware to parse request body as JSON
app.post('/dumpEthScanData', async (req, res) => {
    try {
      const data = req.body.key; // Access the "key" property from the JSON object
      //console.log('here', data);
      await utility.dumpDataToFiles(data);
      res.status(200).send('Data Dump Success : )');
    } catch (error) {
      console.error('Error executing dumpEthScanData api:', error);
      res.status(500).send('Error executing dumpEthScanData api');
    }
  });
  



app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});
