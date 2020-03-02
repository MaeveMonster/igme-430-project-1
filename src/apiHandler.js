/***trivia questions and answers***/
const trivia = [
  { question: 'Which film started out the MCU?', answer: 'Iron Man' },
  { question: 'How many actors have played the role of Peter Parker/Spider-Man?', answer: '3' },
  { question: "What is Black Panther's first name?", answer: "T'chala" },
  { question: 'Who played Bruce Banner in The Incredible Hulk?', answer: 'Edward Norton' },
  { question: 'What type of radiation caused Bruce Banner to become the Hulk?', answer: 'Gamma Radiation' },
  { question: 'What did the Avengers eat after the battle with the Chitauri in the first Avengers movie?', answer: 'Shwarma' },
  { question: "What is Deadpool's real name?", answer: 'Wade Wilson' },
  { question: "What is the name of Thor's hammer?", answer: 'Mjolnir' },
  { question: "What is Captain America's shield made out of?", answer: 'Vibranium' },
  { question: "What is the first name of Tony Stark's father?", answer: 'Howard' },
  { question: 'In the comics and the X-Men films, who is the father of Quicksilver and Scarlet Witch?', answer: 'Magneto' },
  { question: 'Where is Thanos from?', answer: 'Titan' },
  { question: "What metal is bonded to Wolverine's skeleton?", answer: 'Adamantium' },
  { question: 'In Infinity War, who is the first person we saw turn to dust?', answer: 'The Winter Soldier' },
  { question: "Who are Thanos' adoptive daughters?", answer: 'Nebula and Gamora' },
  { question: "What is the Human Torch's real name?", answer: 'Johnny Storm' },
  { question: 'Which Avengers die in Avengers: Endgame?', answer: 'Black Widow and Iron Man' },
  { question: "Which of Spider-Man's enemies has he been romantically attracted to?", answer: 'Black Cat' },
  { question: 'Who directed Thor: Ragnarok?', answer: 'Taika Waititi' },
  { question: 'What do Hawkeye and Black Widow remember very differently?', answer: 'Budapest' },
  { question: "Who ripped Ulysses Klaue's arm off?", answer: 'Ultron' },
  { question: "In the comics, what is the name of Thor's alter ego?", answer: 'Donald Blake' },
];

/***score object***/
const highscores = {};

/***answer to the current question***/
let currentAnswer;

/*** provides response with a JSON object***/
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

/***provides meta response***/
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  response.writeHead(status, headers);
  response.end();
};

/***retrieves random quesrion***/
const getQuestion = (request, response) => {
  const triviaQuestion = trivia[Math.floor(Math.random() * 22)];

  const responseJSON = { question: triviaQuestion.question };

  currentAnswer = { answer: triviaQuestion.answer };

  return respondJSON(request, response, 200, responseJSON);
};

/***gets answer for the current question***/
const getAnswer = (request, response) => respondJSON(request, response, 200, currentAnswer);

/***provides meta response***/
const getQuestionMeta = (request, response) => respondJSONMeta(request, response, 200);

/***adds score to the list of scores***/
const addHighScore = (request, response, body) => {
  const responseJSON = {
    message: 'Name and score are both required.',
  };

  if (!body.name || !body.score) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (highscores[body.name]) {
    responseCode = 204;
  } else {
    highscores[body.name] = {};
  }

  highscores[body.name].name = body.name;
  highscores[body.name].score = body.score;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

/***gets the list of scores***/
const getHighScores = (request, response) => {
  const responseJSON = {
    highscores,
  };

  return respondJSON(request, response, 200, responseJSON);
};

/***gets not found response***/
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found.',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

/***provides meta response***/
const notFoundMeta = (request, response) => respondJSONMeta(request, response, 404);

module.exports = {
  getQuestion,
  getAnswer,
  getQuestionMeta,
  addHighScore,
  getHighScores,
  notFound,
  notFoundMeta,
};
