// waits until the doc is loaded and ready to start the functions and variable assignments
$(document).ready(function () {
  var myKey = '16ceabcc9c9a6f135440a6efd1165492'
  var localStorageCurrent = localStorage.getItem('pastCities');
  var localCities = [];
  var localParsed = JSON.parse(localStorage.getItem('pastCities'));

  //this simply appends li's to the ul dynamically based on how many there are saved so I dont have to repeat the code
  function showHistory() {
    if (localStorageCurrent) {
      localParsed.forEach(function (i) {
        var li = document.createElement('li');
        li.innerText = i;
        $('#history').append(li);
      });
    };
  };

  showHistory();

// this function gets the data you searched and finds it on a geo locater api
  function fetchData(choice) {
    var geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + choice + "&limit=1&appid=" + myKey;

    fetch(geoURL, {
      cache: 'reload',

    }).then(function (response) {
      return response.json();

    }).then(function (data) {

      // then puts the found geolocation into the weather apis so they get results for that place
      var owmURL = 'http://api.openweathermap.org/data/2.5/forecast?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + myKey;
      var todayWeather = 'https://api.openweathermap.org/data/2.5/weather?lat=' + data[0].lat + '&lon=' + data[0].lon + '&units=imperial&appid=' + myKey;

      fetch(owmURL).then(function (response) {
        return response.json();

      }).then(function (data) {
        
        // sets the text of all the attributes below to their corresponding date and time set by the algorithm derrived by me
        $('.5dayFork').each(function (i) {
          $(this).find('.date').text(data.list[i * 8 + 4].dt_txt.split(' ')[0]);
          $(this).find('.condition').attr('src', '#');
          $(this).find('.temp').text('Temperature: ' + data.list[i * 8 + 4].main.temp + 'F');
          $(this).find('.wind').text('Wind speed: ' + data.list[i * 8 + 4].wind.speed + 'mph');
          $(this).find('.humid').text('Humidity: ' + data.list[i * 8 + 4].main.humidity + '%');
        });
      });

      fetch(todayWeather).then(function (response) {
        return response.json();
        // finally sets the same attributes to the today section
      }).then(function (data) {
        console.log(data)
        $('#today').find('.date').text(data.name + ' (' + dayjs().format('MM/DD/YYYY') + ')');
        $('#today').find('.condition').attr('src', '#');
        $('#today').find('.temp').text('Temperature: ' + data.main.temp + ', Feels like: ' + data.main.feels_like);
        $('#today').find('.wind').text('Wind speed: ' + data.wind.speed);
        $('#today').find('.humid').text('Humidity: ' + data.main.humidity);
      });
    });
  };

    //when the button is clicked, we want to save the input, erase the textbox, and store it in localstorage if it follows our rules.
  $('button').on('click', function (event) {
    event.preventDefault();

    var input = $('#username').val().replaceAll(" ", "")
    $('#username').val('');

    if (input) {
      if (localStorageCurrent && !localParsed.includes(input)) {
        localParsed.push(input)
        localStorage.setItem('pastCities', JSON.stringify(localParsed))
      } else if (!localCities.includes(input)) {
        localCities.push(input)
        localStorage.setItem('pastCities', JSON.stringify(localCities))
      };
    };
    //then we show the history and display the data for what you have chosen
    fetchData(input);
  });
  
  // when you click an option on the history list it will run the function that displays the weather with your value
  $('li').on('click', function () {
    var choice = $(this).text()
    fetchData(choice)
  })
});