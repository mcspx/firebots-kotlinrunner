var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.text())

app.get('/', function (req, res) {
  res.send('<html><body><h1>Firebots Kotlin Runner</h1></body></html>');
});

app.post('/kotlin', function(req, res) { //A
    var input = req.body;

    // Create random directory
    var randomstring = require("randomstring");
    var dirName = randomstring.generate(6);
    var fs = require('fs');
    var path = './tmp/' + dirName;
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }

    // Write the file
    var scriptPath = path + '/in.kts';
    fs.writeFileSync(scriptPath, input);

    // Run kotlin
    //const { execSync } = require('child_process');
    //let stdout = execSync('kotlinc -script '+scriptPath);
    const { exec } = require('child_process');
    exec('kotlinc -script '+scriptPath, (err, stdout, stderr) => {
        if (err) {
            console.error(`exec error: ${err}`);
            res.status(400).send(err);
            return;
        }
        res.status(200).send(stdout);
    });

});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
