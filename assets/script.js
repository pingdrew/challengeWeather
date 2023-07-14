$(document).ready(function () {

  $('button').on('click', function (event) {
    event.preventDefault();

    var myKey = '16ceabcc9c9a6f135440a6efd1165492'

    var input = $('#username').val().replaceAll(" ", "")
    console.log(input);

    var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + input + "&limit=1&appid=" + myKey;

    fetch(geoURL, {
      cache: 'reload',

    }).then(function (response) {
      return response.json();

    }).then(function (data) {
      var owmURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + myKey;
      var todayWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + myKey;

      fetch(owmURL).then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log(data)
        // paste here

        $('.5dayFork').each(function(i) {
          $(this).find('.date').text(data.list[i*8+4].dt_txt.split(' ')[0]);
          $(this).find('.condition').text('EMOJI');
          $(this).find('.temp').text('Temperature: ' + data.list[i*8+4].main.temp + 'F');
          $(this).find('.wind').text('Wind speed: ' + data.list[i*8+4].main.temp + 'mph');
          $(this).find('.humid').text('Humidity: ' + data.list[i*8+4].main.temp + '%');
        });
      });

      fetch(todayWeather).then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log(data)
        // paste here
        $('#today').find('.date').text(data.name + ' (' + dayjs().format('MM/DD/YYYY') + ')');
        $('#today').find('.condition').text('EMOJI');
        $('#today').find('.temp').text('Temperature: ' + data.main.temp + ', Feels like: ' + data.main.feels_like);
        $('#today').find('.wind').text('Wind speed: ' + data.wind.speed);
        $('#today').find('.humid').text('Humidity: ' + data.main.humidity);
      });

    });
  });
});