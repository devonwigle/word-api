let fs = require("fs");
let parse = require("csv-parse").parse;

const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3001);
app.locals.title = 'Words';

app.get('/', (request, response) => {
  response.send('Oh hey Words');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});

const records = [];
fs.createReadStream("data.csv")
  .pipe(parse({ delimeter: ",", columns: true}))
  .on("data", (csvrow) => {
    records.push(csvrow);
  })
  .on("end", () => {
    records.forEach((entry) => {
      entry.id = parseInt(entry.id)
      entry.word = entry.word;
    });
    app.locals.words = records;
  });

app.get("/api/v1/words", (request, response) => {
  const words = app.locals.words;

  response.json({ words });
});

app.get("/api/v1/words/:id", (request, response) => {
  const words = app.locals.words.filter((word) => word.id === request.params.id);

  response.json({ words });
});