// Import Packages
const axios = require('axios').default;
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");
const request = require('request');
const qs = require('querystring');

// Import paths self-defined
const Router = require("./routes"); 

// Use packages in app
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.static("data"));
app.unsubscribe(express.urlencoded({extended:false}));

//For testing
app.get("/api", (req, res) => {
    console.log(__dirname);
    res.send("YES!");
});

//file upload
app.post("/api/upload", (req, res) => {
    if(!req.files) {
        return res.status(500).send({msg: "file not found"});
    }
    const myFile = req.files.file;
    const ext = path.extname(myFile.name);
    const filename = Router.uploadtodb(req.body, myFile.name);
    console.log("called upload api, filename after");
    console.log(filename);
    console.log(__dirname);
    myFile.mv(`${__dirname}/data/${filename+ext}`, function(err){
        if(err) {
            console.log("there is an error");
            return res.status(500).send({msg:"error occured"});
        }
        console.log("myfile name");
        console.log(myFile.name);
        return res.send({name:myFile.name, path:`/${myFile.name}`});
    });
    
});

//authenication pls
app.get("/api/auth", async (req, res, next) => {
    console.log(req.query.code);
    const postData = {
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: 'pOfDk9OdGmTIa9Ro0uvpNDBJX6tfQda3tNPLpqRy',
        client_secret: 'hYkGpVbVxPwmLxatD8D1R7lB6QECW39gPCLdOxydujMEUBs3dQp34M0SnHjVfSgFA3G1VyndcPqukPyDK2ArMJtAtYTTZ73wxe1pbztTW5KK69QsLS1ULEbMbrOsvd1F',
        redirect_uri:  'https://pastexam.yagami.dev/api/auth'
    }
    const config = {
        uri: "https://id.nycu.edu.tw/o/token/",
        body: qs.stringify(postData),
        method: "POST",
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    request(config, (error, response)=>{
        console.log(response.body);
        if(error){
            console.log(error);
        }
        const data = JSON.parse(response.body);
        const getusername = {
            uri: "https://id.nycu.edu.tw/api/profile/",
            method: "GET",
            headers: {
                "Authorization": "Bearer "+data.access_token
            }
        }
        request(getusername, (error, response)=>{
            const data = JSON.parse(response.body);
            console.log(data);
            const query = qs.stringify({
                "username": data.username,
                "email": data.email
            })
            // res.cookie("hi", "hi");
            return res.redirect('https://imfpastexams.z11.web.core.windows.net/?'+query);
        })
    })
})

// Use self-defined routes
app.use("/api/dbRouter", Router.router);

app.listen( process.env.PORT || 8082 );