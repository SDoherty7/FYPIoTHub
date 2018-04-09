//Load all of the required modules
const tessel = require('tessel');
const Hapi = require('hapi');
const path = require("path");
const http = require('http');
const util = require('util');
const request = require('request');
const nodemailer = require('nodemailer');

//Ceate the Hapi server,provide port number and Tessel IP
const server = new Hapi.Server();
server.connection({ port: 1967, host: '192.168.1.101' });


server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

//Inert is required to serve html page
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    //Create server routes
    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            //Reply with html webpage, iclude the file path
            reply.file(path.join(__dirname, 'public/index.html'));
        }
    });

    server.route({
        method: 'GET',
        path: '/tempreading/',
        handler: function (request, reply) {
            //Send the array of temperature values to the client
            reply(JSON.stringify(history)).code( 200 );
            console.log("Sending array object");
        }
    });


    server.route({
        method: 'GET',
        path: '/realtime',
        handler: function (request, reply) {
            //Call the function which makes API calls
            apiCall(function(err, data){ 
            if(err) return reply(err);    
            //Send the JSON data to the client   
            reply(data);
            console.log("Sending api info");
        });
        }
    });

    server.route({
        method: 'GET',
        path: '/businfo',
        handler: function (request, reply) {
            busAPI(function(err, data1){ 
            if(err) return reply(err);       
            reply(data1);
        });
        }
    });

    server.route({
        method: 'GET',
        path: '/alarm',
        handler: function (request, reply) {
            //Call the toggle function which activates the alarm and send an acknowledgement to the client
            toggle(function(err){ 
            if(err) return reply(err);
            reply(JSON.stringify("Alarm set"));
        });
        }
    });
});

//API call function with a callback allowing the data to be accessed outside the function
function apiCall(callback){
    //Request JSON data with a personalised api url
    request('http://api.openweathermap.org/data/2.5/weather?q=Dublin&APPID=84535ecfc916c2c3ad8ce3c63fe5b06a', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            result = JSON.stringify(JSON.parse(body));          
            return callback(result, false);
        } else {            
            return callback(null, error);;
        }
    });
}

function busAPI(callback){
    request('http://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=175&format=json', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            results = JSON.stringify(JSON.parse(body));     
            return callback(results, false);
        } else {            
            return callback(null, error);;
        }
    });
}

//Create an array to store temperature values
var history = new Float32Array(30);

// Create a TCP socket to listen for data from Espruino
const server1 = require("net").createServer(conn => {
    console.log('CONNECTED: ' + conn.remoteAddress +':'+ conn.remotePort);
    conn.on('data', data => {
        try {
            //convert JSON object into readable JavaScript
            const temperature = JSON.parse(data);
            
            console.log("Temperature: " + temperature + " C");
            // move history back
            for (var i=1; i<history.length; i++)
            history[i-1]=history[i];
            // insert new history at end
            history[history.length-1] = temperature;
            console.log("Array value is " + history[history.length-1]);
            //Send an acknowledgement to the client
            conn.write("acknowledgement");
        }
        //Catch any errors
         catch(e) {
            console.log(`Error parsing sensor data: ${e}`);
        }
    });
    conn.on('close', function(data) {
        console.log('CLOSED: ' + conn.remoteAddress +' '+ conn.remotePort);
    });
});
//Server listening on port 1235
server1.listen(1235);
console.log("Server listening at 1235 for temperature data");

// Select pin 4 on port A to read LDR data
var pin = tessel.port.A.pin[4]; 

//Function which reads and returns the LDR reading
function alarmSet(callback)  { pin.analogRead((error, number1) =>  {
    if (error) {
        throw error;
    }
    return callback(false, number1); 
});
}

//Toggle function used to set the alarm
function toggle() {
    alarmSet(function(err, data){ 
        var l = data;
        //If the reading is below 0.1 something is bloccking the sensor 
        //so the alarm is triggered
        if (l < 0.1){
            // Turn one of the LEDs on as an alarm.
            tessel.led[2].on();
            console.log("INTRUSION the owner has been notified " + l);
            //call the emailAlert function to send an instant email to the user
            emailAlert(); 
        }
        //If the LDR reading is above 0.1 then the light value is as normal
        else if (l > 0.1) {
            tessel.led[2].off();
            console.log("Alarm set " + l);
            //Set a timeout to take a eading every half a second to prevent the 
            //Tessel from crashing
            setTimeout(toggle, 500);
        }     
});
}

//Function to send an instant email alert to the user 
function emailAlert(){
    //The nodemailer module is used to send the email
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'email',
        pass: 'password'
      }
    });
    //Personalise the email to be sent
    var mailOptions = {
      from: 'dohertys167@gmail.com',
      to: 'dohertys167@gmail.com',
      subject: 'ALARM TRIGGERED',
      text: 'This is an email to notify you that your alarm has been triggered'
    };

    //Send the email and catch any errors
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
});
}
