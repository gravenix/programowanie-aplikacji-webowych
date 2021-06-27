var ApiHelper = /** @class */ (function () {
    function ApiHelper() {
    }
    ApiHelper.BASE_URL = 'http://api.openweathermap.org/data/2.5';
    ApiHelper.APP_ID = '016066152257d46db5368902108e3dcb';
    ApiHelper.buildUrl = function (res) { return ApiHelper.BASE_URL + "/" + res; };
    ApiHelper.getWeatherFor = function (city) {
        return fetch(ApiHelper.buildUrl("weather?q=" + city + "&appid=" + ApiHelper.APP_ID))
            .then(function (response) {
            if (response.status === 404) {
                throw { status: 404 };
            }
            return response.json();
        });
    };
    return ApiHelper;
}());
var WeatherItem = /** @class */ (function () {
    function WeatherItem(place, onDelete) {
        var _this = this;
        this.renderPressure = function () {
            var span = document.createElement('span');
            span.innerHTML = _this.weatherData.main.pressure + " hPa";
            span.className = 'pressure';
            return span;
        };
        this.renderHumidity = function () {
            var span = document.createElement('span');
            span.innerHTML = _this.weatherData.main.humidity + "%";
            span.className = 'humidity';
            return span;
        };
        this.renderTemperature = function () {
            var span = document.createElement('span');
            span.innerHTML = Math.round(parseFloat(_this.weatherData.main.temp) - 273.15) + "&#8451;";
            span.className = 'temperature';
            return span;
        };
        this.renderHeader = function () {
            var header = document.createElement('h2');
            header.innerHTML = _this.place.location;
            return header;
        };
        this.renderIcon = function () {
            var icon = document.createElement('img');
            icon.src = "http://openweathermap.org/img/wn/" + _this.weatherData.weather[0].icon + ".png";
            return icon;
        };
        this.renderCoords = function () {
            var el = document.createElement('span');
            el.innerHTML = "(" + _this.weatherData.coord.lon + ", " + _this.weatherData.coord.lat + ")";
            el.className = 'coords';
            return el;
        };
        this.getNode = function () { return _this.node; };
        this.getPlace = function () { return _this.place; };
        this.onDelete = onDelete;
        this.node = document.createElement('div');
        ApiHelper.getWeatherFor(place.location).then(function (response) {
            _this.weatherData = response;
            _this.place = place;
            _this.node.appendChild(_this.renderHeader());
            _this.node.appendChild(_this.renderCoords());
            _this.node.appendChild(_this.renderIcon());
            _this.node.appendChild(_this.renderTemperature());
            _this.node.appendChild(_this.renderPressure());
            _this.node.appendChild(_this.renderHumidity());
            _this.node.appendChild(_this.renderDeleteCity());
        }).catch(function (err) {
            if (err.status === 404)
                alert("Nie odnaleziono miasta");
            else
                alert(err);
            onDelete(place);
        });
    }
    WeatherItem.prototype.renderDeleteCity = function () {
        var _this = this;
        var span = document.createElement('span');
        span.className = "delete";
        span.innerHTML = "&#10006;";
        span.onclick = function () { return _this.onDelete(_this.place); };
        return span;
    };
    return WeatherItem;
}());
var Weather = /** @class */ (function () {
    function Weather() {
        var _this = this;
        this.onDelete = function (place) { return function () {
            var index = _this.places.indexOf(place);
            if (index > -1) {
                _this.places.splice(index, 1);
                var removed = _this.items.splice(index, 1);
                document.getElementById('places').removeChild(removed[0].getNode());
                _this.saveToLocalStorage();
            }
        }; };
        this.items = [];
        this.places = [];
    }
    Weather.prototype.onAddCity = function () {
        var result = document.getElementById('places');
        var input = document.getElementById('new-place');
        var place = {
            location: input.value,
        };
        var item = new WeatherItem(place, this.onDelete(place));
        this.items.push(item);
        this.places.push(place);
        result.appendChild(item.getNode());
        input.value = '';
        this.saveToLocalStorage();
    };
    Weather.prototype.saveToLocalStorage = function () {
        window.localStorage.setItem('places', JSON.stringify(this.places));
    };
    Weather.prototype.loadFromLocalStorage = function () {
        var _this = this;
        var result = document.getElementById('places');
        var lsCache = window.localStorage.getItem('places');
        if (lsCache === null)
            return;
        this.places = JSON.parse(lsCache);
        this.items = this.places.map(function (place) { return new WeatherItem(place, _this.onDelete(place)); });
        var time = -1200;
        this.items.forEach(function (item) { return setTimeout(function () { return result.appendChild(item.getNode()); }, time += 1200); }); //delay requests
    };
    return Weather;
}());
var weather = new Weather();
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-new-place').addEventListener('click', function () { return weather.onAddCity(); });
    document.getElementById('new-place').addEventListener('keydown', function (e) { return e.key === "Enter" && weather.onAddCity(); });
    weather.loadFromLocalStorage();
});
