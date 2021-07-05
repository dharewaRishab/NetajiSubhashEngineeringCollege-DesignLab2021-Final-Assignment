const express = require('express');
const connection = require('./connection');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

const port = process.env.Port || 3000;

var userEmail;
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.get('/', function (req, res) {
    res.sendFile(__dirname + "/" + "img.html");
});


// to store user input detail on post request
app.post('/', function (req, res) {
    console.log(req.body.email);
    inputData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password,
    }
    // check unique email address
    var sql = 'SELECT * FROM users  WHERE email=?';
    connection.query(sql, [inputData.email], function (error, results, fields) {

        if (error) throw error;

        else if (results.length > 0) {
            var msg = inputData.email + "was already exist";
        }

        else {
            // save users data into database
            var sql = 'INSERT INTO users SET ?';
            connection.query(sql, inputData, function (err, data) {
                if (err) throw err;
            });
            var msg = "Your are successfully registered";


        }
        res.send(msg);

    })

});


app.get('/login', function (req, res) {
    res.sendFile(__dirname + "/" + "login.html");
});


app.post('/login', function (req, res) {

    var emailAddress = req.body.email;
    var password = req.body.password;

    var sql = 'SELECT * FROM users WHERE email =? AND password =?';

    connection.query(sql, [emailAddress, password], function (err, data, fields) {
        if (err) throw err

        if (data.length > 0) {
            userEmail = emailAddress;
            res.redirect('/upload');
        }

        else {
            res.send("Your Email Address or password is wrong");
        }

    });
});

app.get('/upload', function (req, res) {

    var fn, ln;

    var sql = 'SELECT first_name ,last_name FROM users WHERE email =?';

    connection.query(sql, [userEmail], function (err, data, fields) {

        if (err) throw err;

        else {
            var string = JSON.stringify(data);
            var json = JSON.parse(string);
            fn = json[0].first_name;
            ln = json[0].last_name;
        }

    });

    var sql = 'SELECT profile_pic FROM images WHERE email =?';

    connection.query(sql, [userEmail], function (err, data, fields) {


        if (err) throw err;

        else if (data.length > 0) {
            var string = JSON.stringify(data);

            var json = JSON.parse(string);

            console.log(json[0].profile_pic);

            res.render('E:/NODE__/views/database_img', { img: '/images/' + json[0].profile_pic, man: "Welcome " + fn + " " + ln });
        }

        else
            res.render('E:/NODE__/views/database_img', { img: '/images/profile.png', man: "Welcome " + fn + " " + ln });

    });

});


app.post('/upload', function (req, res) {


    if (req.body.fnam !== undefined) {

        connection.query('UPDATE users SET first_name = ? , last_name = ? WHERE email = ? ', [req.body.fnam, req.body.lnam, userEmail], (err, rows) => {
            if (!err) {
                res.send("Your name Updated Successfully");
            } else {
                console.log(err);
            }
        });

    }




    else if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }



    else {
        // name of the input is image
        sampleFile = req.files.image;
        uploadPath = __dirname + '/public/images/' + sampleFile.name;


        // Use mv() to place file on the server
        sampleFile.mv(uploadPath, function (err) {

            if (err) return res.status(500).send(err);


            var sql = 'SELECT * FROM images WHERE email =?';

            connection.query(sql, [userEmail], function (err, data, fields) {
                if (err) throw err;

                else if (data.length > 0) {

                    connection.query('UPDATE images SET profile_pic = ? WHERE email = ? ', [sampleFile.name, userEmail], (err, rows) => {
                        if (!err) {
                            res.send("Image Updated Successfully");
                        } else {
                            console.log(err);
                        }
                    });
                }

                else {
                    inputData = {
                        email: userEmail,
                        profile_pic: sampleFile.name
                    }
                    var sql = 'INSERT INTO images SET ?';
                    connection.query(sql, inputData, function (err, data) {
                        if (err) throw err;
                        else {
                            res.send("Image Uploaded successfully");
                        }
                    });
                }

            });


        });

    }

});

app.listen(port, () => console.log(`server started at port no ${port}`));










