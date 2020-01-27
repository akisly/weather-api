const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

const apiKey = 'ad289972680c997bc611653cc80825c6';
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render("index");
});

app.post('/weather', (req, res) => {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  request(url, {}, (err, response, body) => {
    if (err) {
      res.send(err);
    } else {
      let data = JSON.parse(body);
      let list = data.list;
      if (list === undefined) {
        let error = { cod: data.cod, message: data.message };
        res.send(error);
      } else {
        let weather = [];
        let prevDay = "";
        list.map(item => {
          let dt = new Date(item.dt_txt);
          let time = getTime(item.dt_txt);
          if (prevDay === days[dt.getDay()]) {
            let temp_item = weather.find(item => item.day_txt === prevDay);
            temp_item.data.push({
              day_number: dt.getDate(),
              temp: parseInt(item.main.temp, 10),
              time: time,
              icon: item.weather[0].icon
            })
          } else {
            weather.push({
              day_txt: days[dt.getDay()],
              data: [{
                  day_number: dt.getDate(),
                  temp: parseInt(item.main.temp, 10),
                  time: time,
                  icon: item.weather[0].icon
                }]
            });
          }
          prevDay = days[dt.getDay()];
        });
        res.send(weather);
      }
    }
  });
});

app.listen(8080);

getTime = date => {
  return date.slice(date.indexOf(' ') + 1, date.length - 3);
};
