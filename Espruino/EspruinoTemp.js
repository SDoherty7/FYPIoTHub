function getTemp() {
  var val = analogRead(A1); // read voltage
  //Another option for reading espruino onboard temp
  //var val = E.getTemperature();   
  var millivolts = val * 3300;
  var celsius = millivolts/10;
  return celsius; // and return the temperature
}


var WIFI_NAME = "WifiName";
var WIFI_OPTIONS = { password : "password" };

var wifi;
//Initialise a WiFi connection 
function onInit() {
  wifi = require("EspruinoWiFi");
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(err) {
    if (err) {
      console.log("Connection error: "+err);
      return;
    }
      console.log("Connected to WiFi");
  });
}
onInit();

var temp = getTemp();

function sendData(temp)
{
  //Provide the IP address of the Tessel and the port it is listening on
  var client = require("net").connect({host: "192.168.0.101", port: 1235});
    console.log('client connected');
    client.write(JSON.stringify(temp));

    client.on('data', function(data) {
    console.log(data);

    });
    client.on('close', function() {
      console.log('client disconnected');
    }); 
}  

//Set an interval to send the temp data every minute 
setInterval(() => {
            try{
                sendData(temp);
            } catch(e) {
                console.log(e.toString());
            }
        }, 60000);
