require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { response } = require('express');
const https = require("https");

const app = express();


app.use(bodyParser.urlencoded({ extended: true}));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', (req, res) => {
    const {firstName, lastName, email} = req.body;

    if(!firstName || !lastName || !email){
        res.redirect('/fail.html');
        return;
    }
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName, 
                    LNAME: lastName
                }
            }
        ]
    };

    const postData = JSON.stringify(data);

    const url ='https://us13.api.mailchimp.com/3.0/lists/103b2471d8';

    const options = {
        method: 'POST',
        headers: {
            Authorization: `auth ${process.env.API_KEY}`
        },
        body: postData
    }
    const request = https.request(url, options, function(response){
        response.on('data', (data) => {})
    });

    request.on('error', (e) => {
        console.error(e.message);
      });

    request.write(postData);
    request.end();

    if(response.statusCode === 200){
        res.redirect('/index.html')
    }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));