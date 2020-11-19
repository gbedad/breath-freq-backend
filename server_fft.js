const myFilter = require("./filtering.js")
const express = require('express')
const bodyParser = require('body-parser')
const fs =require('fs')
const port = process.env.PORT || 5000
const cors = require("cors");
const app = express();
app.use(cors());


app.use(bodyParser.json({limit:"50mb", extended : true}))
app.use(bodyParser.urlencoded({limit:'50mb', extended:true}))

app.post('/fftTransform', (req,res)=> {
    
    const por = req.body.datas
    console.log(por.length);

  
// stringify JSON Object
var jsonContent = JSON.stringify(por);

 /*
try {
    fs.writeFileSync('acceloremeterWithM.json', jsonContent);
    console.log("JSON data is saved.");
} catch (error) {
    console.error(err);
} 
*/
 


    if (typeof(por)!= undefined) {
const fin=myFilter.preFFT(por, "noMean", 5)
const magnitudes = myFilter.fourierSSB(fin)
const vectorF = myFilter.fVector(100, magnitudes.length)
let index = magnitudes.indexOf(Math.max(...magnitudes));
const Fs=50
const max_freq= (index/magnitudes.length)*Fs
const f_resp = 60*max_freq
const jRes={ "f_respiratoire": f_resp}
if (jRes <5 || jRes >= 50) {
    const jRes = {"error":"Veuillez reprendre la mesure"}
    res.send(jRes)
}
else {
    res.send(jRes)
    console.log(jRes);
}

    }

    else {
        const jRes= {"error" : "you have to send a json like json= {datas : [Array]}"}
        res.send(jRes)
    }

})


app.listen(port, ()=> {
    console.log('server running on port ', port);
})