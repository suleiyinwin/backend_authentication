const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const port = 3000;
const app = express();
const connection = mysql.createConnection({
    host: "server2.bsthun.com",
    port: "6105",
    user: "lab_1dqizu",
    password: "whwVtiCCKueU0mc3",
    database: "lab_todo02_1d5pghr"
});

connection.connect(() => {
    console.log('Database is connected');
});

app.use(bodyParser.json({ type: "application/json" }))

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/basic/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    var sql = mysql.format(
        'SELECT * FROM users WHERE username =? AND password = ?',
        [username, password]
    );
    console.log("DEBUG: /basic/login => " + sql);
    connection.query(sql, (err, rows) => {
        if(err){
            return res.json({
                success: false,
                data: null,
                error: err.message,
            });
        }
        numRows = rows.length;
        if(numRows == 0){
            res.json({
                success: false,
                message: "Login credential is incorrect",
            });
        }else {
            res.json({
                success: true,
                message: "Login credential is correct",
                user: rows[0],
            });
        }
    })

})

const example = async ()=> {
    const salt1 = await bcrypt.genSalt(10);
    console.log("Salt #1: ", salt1);
    const hash1 = await bcrypt.hash("12345679", salt1);
    console.log("Hash #1: ", hash1);

    const salt2 = await bcrypt.genSalt(10);
    console.log("Salt #2: ", salt2);
    const hash2 = await bcrypt.hash("asdf12123", salt2);
    console.log("Hash #2: ", hash2);

    const valid1 = await bcrypt.compare(
        "12345678",
        '$2b$10$fwkjdMXyeLb7DGaU2UKwTecPJfC7i3ktBP5pFwC3ov71dMSsehus2'
    );
    console.log("Validation #1: ", valid1);

    const valid2 = await bcrypt.compare(
        "12345679",
        '$2b$10$fwkjdMXyeLb7DGaU2UKwTecPJfC7i3ktBP5pFwC3ov71dMSsehus2'
    );
    console.log("Validation #2: ", valid2);

    const valid3 = await bcrypt.compare(
        "asdf12123",
        hash2
    );
    console.log("Validation #3: ", valid3);
}
example();

//assignment 1
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    var sql = mysql.format (
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    console.log("DEBUG: /login => " + sql);
    connection.query(sql, async(err, rows) => {
        if (err){
            return res.json({
                success: false,
                data: null,
                error: err.message,
            });
        }
        numRows = rows.length;
        if(numRows == 0){
            res.json({
                success: false,
                message: "User not found",
            });
        }else {
            const match = await bcrypt.compare(
                password, rows[0].hashed_password);
            if ( match ){
                res.json({
                    success: true,
                    message: "User authentication is a success",
                    user: rows[0],
                })
            }else{
                res.json({
                    success: false,
                    message: "Incorrect password"
                })
            }
            
        }
    })
});

//assignment 2
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //password validation
    if(password.length < 8 || 
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/\d/.test(password)
        ) {
            return res.json({
                success: false,
                message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.'
            });
        }else {
            //generate salt and hash pw
            bcrypt.genSalt(10, (err, salt) => {
                if(err) {
                    return res.json({
                        success: false,
                        data: null,
                        error: err.message,
                    });
                }
                bcrypt.hash(password, salt, (err, hashedpassword) => {
                    if(err) {
                        return res.json({
                            success: false,
                            data: null,
                            error: err.message,
                        });
                    }
                    //inset new user record into db
                    var sql = mysql.format(
                                "INSERT INTO users (username, password, hashed_password) VALUES (?, ?, ?)",
                                [username, password, hashedpassword]
                                );
                    connection.query(sql, (err, rows) => {
                        if(err) {
                            return res.json({
                                success: false,
                                data: null,
                                error: err.message,
                            });
                        } else {
                            if(rows) {
                                res.json({
                                    success: true,
                                    data: {
                                        message: "Registration success"
                                    }
                                })
                            }
                        }
                    })
                })
            })
        }

    
});


app.listen( port, () => {
    console.log(`Example app listening on port ${port}`);
})