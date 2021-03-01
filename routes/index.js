const express = require("express");
const { forInRight } = require("lodash");
const db = require("../db");
const extpath = require("path");

const router = express.Router();

//測試用不用在意
// ***************************************************
router.get("/test", async (req, res, next) => {
    try{
        let results = await db.test();
        Object.values(results).forEach(val => console.log(val.coursename)); // 得到所有的值

        res.json(results);
    } catch(e){
        console.log("failed");
        res.sendStatus(500);
    }
});
// ****************************************************
//測試結束


router.get("/getcourseexams", async (req, res, next) => {
    try{
        let results = await db.all(req);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/getcourseforgrades/:id", async (req, res, next) => {
    try{
        let results = await db.getcourses(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/getallcourses", async (req, res, next) =>{
    try{
        let results = await db.getallcourses();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.get("/getallteachers", async (req, res, next) =>{
    try{
        let results = await db.getallteachers();
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

router.get("/download/:id", async (req, res, next) => {
    try{
        const id = req.params.id;
        console.log(id);
        let results = await db.getfilename(id);
        const filename = results[0].filename;
        const ext = extpath.extname(filename)
        const file = id+ext;
        console.log(file);
        res.download(extpath.join("data", file), filename);
        // res.sendFile("data/"+file);
        // res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

router.get("/file/:filename", (req, res) => {
    const file = "data/"+filename;
    res.download(file);
});

function uploadtodb(body, filename) {
    const id = db.upload(body, filename);
    return id;
};

module.exports = {
    router,
    uploadtodb,
}