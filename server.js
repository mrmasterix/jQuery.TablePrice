const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./config.json').development;
const webpackHotMiddleware = require('webpack-hot-middleware');
const app = express();

const configWebpack = require('./webpack-configs/dev.config.js');
const compiler = webpack(configWebpack);
const devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: configWebpack.output.publicPath,
});

const port = config.port;

app.use(devMiddleware);
app.use(webpackHotMiddleware(compiler));

app.listen(port, () => {
  console.log(`Server start on 127.0.0.1:${port}`);
});

app.use((req, res) => {
  res.set('Content-Type', 'text/html');
  const indexHtml = devMiddleware.fileSystem.readFileSync(`${configWebpack.output.path}/index.html`);
  res.send(indexHtml);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'text/html' }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));
