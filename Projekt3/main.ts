class ApiHelper {
    static readonly BASE_URL = 'http://api.openweathermap.org/data/2.5';
    static readonly APP_ID = '016066152257d46db5368902108e3dcb';

    private static buildUrl = (res :string) => `${ApiHelper.BASE_URL}/${res}`;

    static getWeatherFor = (city :string) :any =>
        fetch(ApiHelper.buildUrl(`weather?q=${city}&appid=${ApiHelper.APP_ID}`))
            .then(response => {
                if (response.status === 404) {
                    throw {status: 404};
                }
                return response.json()
            });
}

interface WeatherPlace {
    location: string,
}

class WeatherItem {
    private place: WeatherPlace
    private node :any;
    private weatherData :any;
    private onDelete :(WeatherPlace) => void;

    constructor(place :WeatherPlace, onDelete :(WeatherPlace) => void) {
        this.onDelete = onDelete;
        this.node = document.createElement('div');
        ApiHelper.getWeatherFor(place.location).then(response => {
            this.weatherData = response;
            this.place = place;
            this.node.appendChild(this.renderHeader());
            this.node.appendChild(this.renderCoords());
            this.node.appendChild(this.renderIcon());
            this.node.appendChild(this.renderTemperature());
            this.node.appendChild(this.renderPressure());
            this.node.appendChild(this.renderHumidity());
            this.node.appendChild(this.renderDeleteCity());
        }).catch((err) => {
            if (err.status === 404) alert("Nie odnaleziono miasta");
            else alert(err);
            onDelete(place);
        });
    }

    private renderDeleteCity() {
        let span = document.createElement('span');
        span.className = "delete";
        span.innerHTML = "&#10006;";
        span.onclick = () => this.onDelete(this.place)
        return span;
    }

    private renderPressure = () => {
        let span = document.createElement('span');
        span.innerHTML = `${this.weatherData.main.pressure} hPa`;
        span.className = 'pressure';
        return span;
    }

    private renderHumidity = () => {
        let span = document.createElement('span');
        span.innerHTML = `${this.weatherData.main.humidity}%`;
        span.className = 'humidity';
        return span;
    }

    private renderTemperature = () => {
        let span = document.createElement('span');
        span.innerHTML = `${Math.round(parseFloat(this.weatherData.main.temp) - 273.15)}&#8451;`;
        span.className = 'temperature';
        return span;
    }

    private renderHeader = () => {
        let header = document.createElement('h2');
        header.innerHTML = this.place.location;
        return header;
    }

    private renderIcon = () => {
        let icon = document.createElement('img');
        icon.src = `http://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}.png`;
        return icon;
    }

    private renderCoords = () => {
        var el = document.createElement('span');
        el.innerHTML = `(${this.weatherData.coord.lon}, ${this.weatherData.coord.lat})`;
        el.className = 'coords';
        return el;
    }

    getNode = () :HTMLDivElement => this.node;

    getPlace = () :WeatherPlace => this.place;

}

class Weather {
    private items :WeatherItem[];
    private places :WeatherPlace[];

    constructor() {
        this.items = [];
        this.places = [];
    }

    onDelete = (place :WeatherPlace) => () => {
        let index = this.places.indexOf(place);
        if (index > -1) {
            this.places.splice(index, 1);
            let removed = this.items.splice(index, 1);
            document.getElementById('places').removeChild(removed[0].getNode());
            this.saveToLocalStorage();
        }
    }

    onAddCity() {
        var result = document.getElementById('places');
        var input = <HTMLInputElement>document.getElementById('new-place');
        var place = {
            location: input.value,
        };
        var item = new WeatherItem(place, this.onDelete(place));
        this.items.push(item);
        this.places.push(place);
        result.appendChild(item.getNode());
        input.value = '';
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        window.localStorage.setItem('places', JSON.stringify(this.places));
    }

    loadFromLocalStorage() {
        var result = document.getElementById('places');
        let lsCache = window.localStorage.getItem('places');
        if (lsCache === null) return 
        this.places = JSON.parse(lsCache);
        this.items = this.places.map((place :WeatherPlace) => new WeatherItem(place, this.onDelete(place)));
        let time = -1200;
        this.items.forEach((item :WeatherItem) => setTimeout(() => result.appendChild(item.getNode()), time+=1200)); //delay requests
    }

}

const weather = new Weather();
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-new-place').addEventListener('click', () => weather.onAddCity())
    document.getElementById('new-place').addEventListener('keydown', (e :any) => e.key === "Enter" && weather.onAddCity())
    weather.loadFromLocalStorage();
})