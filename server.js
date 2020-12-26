// Import Packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");

// Import paths self-defined
const dbRouter = require("./routes");

// Use packages in app
const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(morgan("combined"));
app.use(express.static("data"));
app.unsubscribe(express.urlencoded({extended:false}));


//file upload
app.post("/upload", (req, res) => {
    if(!req.files) {
        return res.status(500).send({msg: "file not found"});
    }
    const myFile = req.files.file;
    const ext = path.extname(myFile.name);
    const filename = dbRouter.uploadtodb(req.body, myFile.name);
    myFile.mv(`./data/${filename+ext}`, function(err){
        if(err) {
            console.log(err);
            return res.status(500).send({msg:"error occured"});
        }
        return res.send({name:myFile.name, path:`/${myFile.name}`});
    });
    
});

app.get("/hello", (req, res) => {
    res.send("Hello World!");
})

// Use self-defined routes
app.use("/dbRouter", dbRouter.router);

app.listen( process.env.PORT || 8081 );