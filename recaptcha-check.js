const querystring = require('querystring');
const https = require('https');

module.exports = async (token) => {    
    return new Promise((resolve, reject) => {
        const recaptcha_values = querystring.stringify({
            'secret': process.env.RECAPTCHA_SECRET,
            'response': token
        });

        const recaptcha_options = {
            host: 'google.com',
            path: '/recaptcha/api/siteverify',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const post_req = https.request(recaptcha_options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
                var data = JSON.parse(chunk);
                if (data.success == true) {
                    console.log('ReCAPTCHA valid, sending email');
                    resolve('Valid');
                }
                else {
                    console.log('ReCAPTCHA invalid!');
                    resolve('Invalid');
                }
            });
        });

        post_req.on('error', function (e) {
            console.log("Got error: " + e.message);
            reject('Error');
        });

        post_req.write(recaptcha_values);
        post_req.end();
    });
}