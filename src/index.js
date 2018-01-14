import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
require('bootstrap-loader');
require('font-awesome-webpack-sass');
// const resume = require('./resume.json'); // load resume file

// const project = require('./project.json'); // load resume file

ReactDOM.render(
  <App jsonObj={{
    // resume: resume,
    // project: project
  }} />,
  document.getElementById('root')
);
