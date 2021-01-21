// Import Packages
const axios = require('axios');
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");
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
app.get("/", (req, res) => {
    res.send("YES!");
});

//file upload
app.post("/upload", (req, res) => {
    if(!req.files) {
        return res.status(500).send({msg: "file not found"});
    }
    const myFile = req.files.file;
    const ext = path.extname(myFile.name);
    const filename = Router.uploadtodb(req.body, myFile.name);
    myFile.mv(`./data/${filename+ext}`, function(err){
        if(err) {
            console.log(err);
            return res.status(500).send({msg:"error occured"});
        }
        return res.send({name:myFile.name, path:`/${myFile.name}`});
    });
    
});

//authenication
app.get("/auth/:code", (req, res) => {
    console.log(req.params);
    var name = '';
    const config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };
    const url = "https://id.nycu.edu.tw/o/token/";
    axios.post(
        url,
        qs.stringify({
            grant_type: 'authorization_code',
            code: req.params.code,
            client_id: 'pOfDk9OdGmTIa9Ro0uvpNDBJX6tfQda3tNPLpqRy',
            client_secret: 'hYkGpVbVxPwmLxatD8D1R7lB6QECW39gPCLdOxydujMEUBs3dQp34M0SnHjVfSgFA3G1VyndcPqukPyDK2ArMJtAtYTTZ73wxe1pbztTW5KK69QsLS1ULEbMbrOsvd1F',
            redirect_uri: 'https://imfpastexams.z11.web.core.windows.net/'
        }),
        config
    ).then( res => {
        const token = res.data.access_token;
        const authstr = "Bearer ".concat(token);
        console.log(authstr);
        axios.get("https://id.nycu.edu.tw/api/profile/", {headers:{Authorization: authstr}}).then(res=>{
            name = res.data.username;
        })
    })
    res.send(name);
})

// Use self-defined routes
app.use("/dbRouter", Router.router);

app.listen( process.env.PORT || 8081 );