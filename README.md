# FYPIoTHub
Final Year Project -  Internet of Things Hub Using JavaScript

### IoT Hub Code
This repository contains code for the IoT hub, written in JavaScript/ Node.js with some HTML. This is located in the Espruino and Tessel folders which are the two JavaScript native development boards used in the project. 
The Tessel acts as a central server which handles and processes data from its own connected LDR sensor and also listens for a connection with the Espruino and accepts its input. The Tessel then publishes the processed sensor data on a webpage along with customized data from API calls. The hub design is an attempt at incorporating a broad range of JavaScript and Node programming features and methods. 

### Performance Tests
The PerfTest and PerformanceMetrics folders contain the code relevant to the performance tests detailed in the project report. 

The PerfTest folder contains the performance test code of the simple HTTP servers written using various Node Frameworks. This test is run by using Apache Bench which fires GET requests at the servers which are configured to return "Hello World". Full details of the operations and results of this test are present in the project report.
The PerformanceMetrics folder contains the code relevant for the comparison test between the different languages using a variety of standard computation problems. The Intel RAPL (Running Average Power Limit) tool is also present which measures power usage. The full operations and results from this test can be seen in the project report.
