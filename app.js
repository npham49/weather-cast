const form = document.querySelector("form");
const input = document.querySelector(".container input");
const apiKey = " "; //Enter your API Key here
const citycontainer = document.querySelector(".container-res .cityname");
const list = document.querySelector(".container-res .result-current");
var message = document.getElementById("message");

form.addEventListener('submit',function(e) {
    e.preventDefault();
    let inputVal = input.value.toLowerCase();
    getWeatherData(inputVal);
});


let long = 0.0;
let lat = 0.0;
let cities = [];
function getWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
    .then(function (response) {
        let data = response.json()
        return data
    })
    .then(function (data) {
        
        long = data.coord.lon
        lat = data.coord.lat
        const select = document.querySelector("select");
        if (select.value=='current') {
            if (cities.length==0) {
                message.innerHTML='';
                citycontainer.innerHTML = '';
                list.innerHTML='';
            }
            if (cities.includes(data.name)) {
                message.innerHTML='';
                var text = document.createTextNode("Error: The city is already in the list");
                message.appendChild(text);
            }else {
                message.innerHTML='';
                displayCurWeather(data);
                cities.push(data.name);
            }
            
        } else if (select.value=='daily') {
            message.innerHTML='';
            citycontainer.innerHTML = '';
            list.innerHTML='';
            cities = [];
            displayDaily(long,lat,data.name);
        } else if (select.value=='hourly') {
            message.innerHTML='';
            citycontainer.innerHTML = '';
            list.innerHTML='';
            cities = [];
            displayHourly(long,lat,data.name);
        }
        document.getElementById('search-box').value = ''
        
    })
    .catch ((error)=> {
        message.innerHTML='';
        var text = document.createTextNode("Error: Please enter a valid city");
        message.appendChild(text);
    } )
}


function displayCurWeather(data) {
    const li = document.createElement("li");
    const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    li.classList.add("city");
    const markup = `
  <h2 class="city-name" data-name="${data.name}">
    <span>${data.name}</span>
  </h2>
  <div class="city-temp">${Math.round(data.main.temp)}<sup>°C</sup>
  </div>
  <figure>
    <img class="city-icon" src=${icon} alt=${data.weather[0].main}>
    <figcaption>${data.weather[0].description}</figcaption>
  </figure>
`;
    li.innerHTML = markup;
    list.appendChild(li);
    form.reset();
}

function displayDaily(long,lat,city) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=current,hourly,minutely,alerts&units=metric&appid=${apiKey}`;
    (async () => {
        const res = await fetch(url);
        const data = await res.json();
        const cityname = document.createElement("h1");
        cityname.classList.add("cityname");
        cityname.innerHTML = `${city}`;
        citycontainer.appendChild(cityname);
        data.daily.forEach((value,index)=> {
            if (index>0) {
                var dayname = new Date(value.dt * 1000).toLocaleDateString("en", {
                    weekday: "long",
                });
                
                var temp = Math.round(value.temp.day);
                const icon = `https://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`;
                const li = document.createElement("li");
                li.classList.add("city");
                const markup = `
                <h2 class="city-name" data-name="${dayname}">
                    <span>${dayname}</span>
                </h2>
                <div class="city-temp">${temp}<sup>°C</sup>
                </div>
                <figure>
                    <img class="city-icon" src=${icon} alt=${value.weather[0].main}>
                    <figcaption>${value.weather[0].description}</figcaption>
                </figure>
                `;
                li.innerHTML = markup;
                list.appendChild(li);
            }
        })
        
    })();
}

function displayHourly(long,lat,city) {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=current,daily,minutely,alerts&units=metric&appid=${apiKey}`;
    (async () => {
        const res = await fetch(url);
        const data = await res.json();
        const cityname = document.createElement("h1");
        cityname.classList.add("cityname");
        cityname.innerHTML = `${city}`;
        citycontainer.appendChild(cityname);
        data.hourly.forEach((value,index)=> {
            if (index<12) {
                var time = new Date(value.dt * 1000).toLocaleTimeString("en", {
                    hour: '2-digit',
                    minute: '2-digit',
                });
                
                var temp = Math.round(value.temp);
                const icon = `https://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`;
                const li = document.createElement("li");
                li.classList.add("city");
                const markup = `
                <h2 class="city-name" data-name="${time}">
                    <span>${time}</span>
                </h2>
                <div class="city-temp">${temp}<sup>°C</sup>
                </div>
                <figure>
                    <img class="city-icon" src=${icon} alt=${value.weather[0].main}>
                    <figcaption>${value.weather[0].description}</figcaption>
                </figure>
                `;
                li.innerHTML = markup;
                list.appendChild(li);
            }
        })
        
    })();
}