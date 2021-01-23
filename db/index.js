const mysql = require("mysql2");
const sha256 = require("crypto-js/sha256");
const { rest, reject } = require("lodash");

const sqlite3 = require("sqlite3").verbose();
const file = "./imfpastexams.db";

var database = new sqlite3.Database(file);

let db = {};

db.test = () => {
    var sql = "SELECT coursename FROM grades WHERE grade = 1 ORDER BY coursename DESC LIMIT 5";
    var params = [];
    return new Promise((resolve, reject)=>{
        database.all(sql, params, (err, rows) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            console.log(rows)
            return resolve(rows);
        });
    })
    
};

db.all = (req) => {
    // var course = req.params.course;
    const course = req.query[0];
    var sql = `SELECT * FROM courses WHERE course = "${course}" ORDER BY year DESC`;
    var params = [];
    return new Promise((resolve, reject)=>{
        database.all(sql, params, (err, rows) =>{
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(rows);
        })
    });
};

db.getcourses = (id) => {
    var sql = `SELECT coursename FROM grades WHERE grade = ${id} ORDER BY coursename DESC`;
    var params = [];
    return new Promise((resolve, reject)=>{
        database.all(sql, params, (err, rows) =>{
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(rows);
        });
    });
};

db.getallcourses = () => {
    var sql = `SELECT coursename FROM grades ORDER BY coursename DESC`;
    var params = [];
    return new Promise((resolve, reject)=>{
       database.all(sql, params, (err, rows)=>{
           if(err){
               console.log(err);
               return reject(err);
           }
           return resolve(rows);
       })
    });
};

db.getallteachers = () => {
    const sql = `SELECT DISTINCT teacher FROM courses`;
    var params = [];
    return new Promise((resolve, reject)=> {
        database.all(sql, params, (err, rows) => {
            if(err){
                console.log(err);
                return reject(err);
            }
            return resolve(rows);
        })
    });
};

db.upload = (body, filename) => {
    let year = body.year;
    let type = body.type;
    let course = body.course;
    let teacher = body.teacher;
    let grade = body.grade;
    let provider = body.provider;
    let code = course+year+type+teacher+filename;
    let id = sha256(code).toString();

    database.run(
        `INSERT INTO courses VALUES(?,?,?,?,?,?,?,?)`, 
        [id, year, course, teacher, type, filename, grade, provider],
        (err)=>{
            if(err){
                return console.log(err.message);
            }
            console.log("Row was added to table");
        }
    );
    
    return id;
}

db.getfilename = (id) => {
    console.log(id);
    const sql = `SELECT filename FROM courses WHERE id = '${id}'`;
    var params =  [];
    return new Promise((resolve, reject)=>{
        database.all(sql, params, (err, rows)=>{
            if(err){
                console.log(err.message);
                return reject(err);
            }
            return resolve(rows);
        })
    });
};

module.exports = db;