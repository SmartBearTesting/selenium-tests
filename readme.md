# Using Selenium testing with [crossbrowsertesting.com](http://crossbrowsertesting.com)

_Thanks for Chase at Crossborwsertesting for providing me the base for this snippet!_

A sample script to show how to interact with the Selenium driver AND Crossborwsertesting's Rest API to take screenshots while passing commands to the browser.

I'm using NodeJS with the excellent [webdriverio](http://webdriver.io) module to interact with Selenium. 

The main routine is using the ES6 generator function with an external runner file (`runner.js`) to iterate through the `yield` points in the generator. webdriverio commands return promises and generator function with the runner let's me write a very linear looking, but fundamentally asynchronous operations.

At key points in the execution, I'm taking screenshots of the browser, using the Crossbrowsertesting Rest API.

**NOTE**

This is just a starting point, to demonstrate how to use Selenium, NodeJS and the CBT Rest API.  

##To use

`npm install`

Put your crossborwsertesting credentials in `secrets.json`:

```
{
      "user": "yourusername@email.com",
      "key": "yourkey"
}
```

I've put a few browser definitions in `browser.json`. You can add more by using the [wizard](https://app.crossbrowsertesting.com/selenium/run) on the Selenium testing tab.

Then finally:

`node wdio_test`

