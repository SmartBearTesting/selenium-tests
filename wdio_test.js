var webdriverio = require('webdriverio');
var request = require('request');
var fs = require('fs');
var runner = require('./runner');

credentials = JSON.parse(fs.readFileSync('./secrets.json'));
browsers = JSON.parse(fs.readFileSync('./browsers.json'));

var desiredCapabilities = {
    name : 'Signup Test IE_10 debug',
    build :  '1.0.1',
    record_video : 'true',
    record_network : 'true',
    pageLoadStrategy: 'eager'
};

var serviceOptions = {
  host: 'hub.crossbrowsertesting.com',
  port: 80,
  user: credentials.user,
  key: credentials.key
};


function createOptions (browser) {
    return Object.assign(serviceOptions, {desiredCapabilities: Object.assign(desiredCapabilities, browsers[browser])});
}

var targetBrowser = 'GalaxyS5_Phone';
// create your webdriverio.remote with your options as an argument
var client = webdriverio.remote(createOptions(targetBrowser));

function takeScreenshot (sessionId) {
    return new Promise(function(resolve){
        request({
        method: 'POST',
        uri: 'https://crossbrowsertesting.com/api/v3/selenium/' + sessionId + '/snapshots',
        callback: function (error, response, body) {
            if (error) {
            return console.error('Request failed:', error);
            }
            console.log('Screenshot taken');
            resolve(body);
        }
        }).auth(credentials.user, credentials.key);

    });
}

function *signup() {
        
    var init = yield client.init();
    var sessionId = init.sessionId;

    yield client.url('http://example.com');

    console.log('------- page loaded ---------');

    yield takeScreenshot(sessionId);

    yield client.click('#examplediv > div > div > p:nth-child(3) > button');

    yield takeScreenshot(sessionId);

    yield client.click('#navbar > ul > li.dontmove.visible-sm.visible-md.visible-lg > a');

    client.waitForVisible('#myModal', 3000);

    yield takeScreenshot(sessionId);
    
    yield client.element('#lostpassword').click('=Register');

    // will test filling out a form
    yield client.url('https://example.com/account/create');

    yield client.setValue('#create_account_first_name', 'testuser');
    
    yield client.setValue('#create_account_last_name', targetBrowser);

    yield client.setValue('#create_account_email_first', targetBrowser + '_user');
    
    yield client.setValue('#create_account_email_second', targetBrowser + '_user_none');
    yield takeScreenshot(sessionId);

    // testing adding a new user with a unique id
    var currentDate = new Date();
    var userID = '' + currentDate.getFullYear() +  currentDate.getMonth() + currentDate.getDay() + currentDate.getHours() + currentDate.getMinutes() + currentDate.getSeconds();
    
    yield client.setValue('#create_account_email_first', targetBrowser + '_user_' + userID + '@testing.com');
    yield takeScreenshot(sessionId);

    yield client.setValue('#create_account_email_second', targetBrowser + '_user_' + userID + '@testing.com');
    yield takeScreenshot(sessionId);

    yield client.scroll('#create_account_email_first');

    yield client.setValue('#create_account_password_first', '12345678');

    yield client.setValue('#create_account_password_second', '12345678');
    yield takeScreenshot(sessionId);

    yield client.selectByAttribute('#create_account_country', 'value', '210');
    yield takeScreenshot(sessionId);

    yield client.selectByAttribute('#create_account_country', 'value', '11');
    yield client.selectByAttribute('#create_account_timezone', 'value', '44');
    yield takeScreenshot(sessionId);

    yield client.click('#create_account_accept_terms');  
    yield client.click('#create-account-form_submit-button');  
    
    // wait 3s
    yield client.waitForExist('#anotherdiv', 4000);
    yield takeScreenshot(sessionId);

    // ------------     DONE       -----------------
    console.log('test succesfully completed');    
    yield client.end();

}

runner( signup );
