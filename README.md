# quandlism

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

There is a (very) basic ExpressJS test app in the /app directory that will use your development version of Quandlism with production data (via the API) . To run it:

> node app/app.js

Go to: http://localhost:3003

