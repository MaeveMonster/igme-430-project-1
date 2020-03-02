const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./apiHandler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

/***handles post requests***/
const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addHighScore') {
    const res = response;

    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);

      jsonHandler.addHighScore(request, res, bodyParams);
    });
  }
};

/***handles get requests***/
const handleGet = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/style.css') {
    htmlHandler.getCSS(request, response);
  } else if (parsedUrl.pathname === '/getQuestion') {
    jsonHandler.getQuestion(request, response);
  } else if (parsedUrl.pathname === '/getHighScores') {
    jsonHandler.getHighScores(request, response);
  } else if (parsedUrl.pathname === '/getAnswer') {
    jsonHandler.getAnswer(request, response);
  } else if (parsedUrl.pathname === '/') {
    htmlHandler.getIndex(request, response);
  } else {
    jsonHandler.notFound(request, response);
  }
};

/***handles meta requests***/
const handleHead = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/getQuestion') {
    jsonHandler.getQuestionMeta(request, response);
  } else {
    jsonHandler.notFoundMeta(request, response);
  }
};

/***occurs upon any request***/
const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  console.log(`Request method: ${request.method}`);

  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (request.method === 'HEAD') {
    handleHead(request, response, parsedUrl);
  } else {
    handleGet(request, response, parsedUrl);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

// http://localhost:3000/addUser?name=Katie&age=21
