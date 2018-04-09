var flatiron = require('flatiron'),
    app = flatiron.app;
 
app.use(flatiron.plugins.http);
 
app.router.get('/', function () {
  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.end('Hello world!\n');
});
 
app.start(8000);