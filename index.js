async function apiCall(value){
    try{
      
        const apiUrl = 'http://localhost:9010/dumpEthScanData';
        const requestData = {
          key: value
        };
        
            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(requestData)
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.text();
            console.log(data); // Output the response from the server
         
    
        

    }catch(ee){
        console.log('Error',ee);
    }
}

apiCall('heyy i am hitting this api')