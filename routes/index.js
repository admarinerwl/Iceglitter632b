const express = require("express");
const { forInRight } = require("lodash");
const db = require("../db");

const router = express.Router();

router.get("/test", async (req, res, next) => {
    try{
        let results = await db.test();
        console.log(results)
        
        Object.values(results).forEach(val => console.log(val.coursename)); // 得到所有的值

        res.json(results);
    } catch(e){
        console.log("failed");
        res.sendStatus(500);
    }
})

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
        let results = await db.getfilename(req.params.id);
        res.json(results);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
});

function uploadtodb(body, filename) {
    const id = db.upload(body, filename);
    return id;
};



module.exports = {
    router,
    uploadtodb,
}