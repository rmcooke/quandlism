# DEPRECATED

This project is not under active development. The repo will be closed on May 1st.


## quandlism

Canvas wrapper for displaying time series data with D3

## Usage

To generate quandlism.js and quandlism.min.js

### Install NodeJS

> brew install node

### Install NPM

From site [npm](https://npmjs.org/)

### Clone project

> git clone git@github.com:quandl/quandlism.git
> cd quandlism


### Install Dependencies

> npm install 

This installs dependencies into node_modules folder in project root, which is ignored in source control.

### Watch files

> grunt watch

This will watch the src/*.coffee files for changes and rebuild the .js file when needed. To manually rebuild the project, use the 'all' task:

> grunt all

This tells quandlism to concatentate the coffee files, process them and put the output in quandlism.js

### Test App

There is a (very) basic ExpressJS test app in the /app directory that will use your development version of Quandlism with production data (via the API). 
Before you can use the app:

#### Symlink Assets

Create symlinks in app/public/javascripts for d3.v2.js and quandlism.js

#### API Key

Get an API key from Quandl.com. 

If you don't have an account, sign up at [Quandl](http:www.quandl.com), then go [here](http://www.quandl.com/users/edit) to get your authentication token.
Open app/settings.coffee and replace 'YOUR_API_KEY_HERE' with your key.

-

Run the app:

> node app/app.js

Go to: http://localhost:3003

