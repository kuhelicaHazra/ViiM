var express = require('express');
var path = require('path');
var router = express.Router();
var file1 = './assets/markers.json';
var file2 = './assets/resortmap.json'
const fs = require('fs');

// read JSON file async

router.get('/getmapmarker',(req,res)=>{
   fs.readFile(file1, (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
});
});


router.route('/:resortid/getimagemapareas').get((req,res)=>{
    fs.readFile(file2, (err, data) => {
        if (err) throw err;
        JSON.parse(data).forEach(element => {
            if(req.params.resortid === element.ID){
                res.send(element.properties);
            }
        });
    });
 });
module.exports = router;