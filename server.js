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

//authenication pls
app.get("/auth", async (req, res, next) => {
    console.log(req.query.code);
    const postData = {
        grant_type: 'authorization_code',
        code: req.query.code,
        client_id: 'pOfDk9OdGmTIa9Ro0uvpNDBJX6tfQda3tNPLpqRy',
        client_secret: 'hYkGpVbVxPwmLxatD8D1R7lB6QECW39gPCLdOxydujMEUBs3dQp34M0SnHjVfSgFA3G1VyndcPqukPyDK2ArMJtAtYTTZ73wxe1pbztTW5KK69QsLS1ULEbMbrOsvd1F',
        redirect_uri:  'https://pastexams-backend.azurewebsites.net/auth'
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
            var date = new Date();
            var minutes = 10;
            date.setTime(date.getTime()+(minutes*60*1000));
            if(error){
                res.cookie('username', "none", {expires: date.toUTCString()})
            }
            // res.cookie("username", data.username, {expires: date.toUTCString()});
            // res.cookie("email", data.email, {expires: date.toUTCString()});
            // return res.send(data);
            return res.redirect("https://imfpastexams.z11.web.core.windows.net/");
        })

    })
    

    // console.log(req.params.code);
    // const config = {
    //     headers: {
    //         "Content-Type": "application/x-www-form-urlencoded"
    //     }
    // };
    // const url = "https://id.nycu.edu.tw/o/token/";
    // try{
    //     await axios({
    //         method: "post",
    //         url: url,
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         body: {
    //             grant_type: 'authorization_code',
    //             code: req.params.code,
    //             client_id: 'pOfDk9OdGmTIa9Ro0uvpNDBJX6tfQda3tNPLpqRy',
    //             client_secret: 'hYkGpVbVxPwmLxatD8D1R7lB6QECW39gPCLdOxydujMEUBs3dQp34M0SnHjVfSgFA3G1VyndcPqukPyDK2ArMJtAtYTTZ73wxe1pbztTW5KK69QsLS1ULEbMbrOsvd1F',
    //             redirect_uri:  'https://imfpastexams.z11.web.core.windows.net/'
    //         }
    //     }).then((response)=>{
    //         console.log(response.data);
    //         res.send(response.data);
    //     })
    //     await axios.post(
    //         url,
    //         {
    //             grant_type: 'authorization_code',
    //             code: req.params.code,
    //             client_id: 'pOfDk9OdGmTIa9Ro0uvpNDBJX6tfQda3tNPLpqRy',
    //             client_secret: 'hYkGpVbVxPwmLxatD8D1R7lB6QECW39gPCLdOxydujMEUBs3dQp34M0SnHjVfSgFA3G1VyndcPqukPyDK2ArMJtAtYTTZ73wxe1pbztTW5KK69QsLS1ULEbMbrOsvd1F',
    //             redirect_uri:  'https://imfpastexams.z11.web.core.windows.net/'
    //         },
    //         config
    //     ).then(t=>{
    //         return res.send(t.data.access_token);
            // const token = t.data.access_token;
            // const authstr = "Bearer ".concat(token);
            // console.log(authstr);
            // axios.get(
            //     "https://id.nycu.edu.tw/api/profile/",
            //     {
            //         headers: {Authorization: authstr}
            //     }
            // ).then(user=>{
            //     res.send(user.data.username);
            // })
        // })
    // }
    // catch(err){
    //     res.send("fuck you")
    //     // next(err)
    // }
})

// Use self-defined routes
app.use("/dbRouter", Router.router);

app.listen( process.env.PORT || 8081 );