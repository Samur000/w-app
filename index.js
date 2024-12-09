// Ваш ключ API от WeatherAPI
const apiKey = 'e9d85f415d5c4c009ed212436240912';

document.getElementById('city-form').addEventListener('submit', function (event) {
	event.preventDefault();

	const cityName = document.getElementById('city-input').value;

	if (cityName.trim() === '') {
		alert('Пожалуйста, введите название города.');
		return;
	}

	fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=7`)
		.then(response => {
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}
			return response.json();
		})
		.then(data => {
			if (data.error) {
				alert("Город не найден.");
				return;
			}

			// Формируем массив для хранения ежедневных прогнозов
			const dailyForecasts = data.forecast.forecastday.map(day => ({
				date: day.date,
				temp_c: day.day.avgtemp_c,
				condition_text: day.day.condition.text,
				humidity: day.day.avghumidity,
				wind_kph: day.day.maxwind_kph,
				icon_url: day.day.condition.icon
			}));
			

			// Формируем HTML-разметку для каждого дня
			let weatherMarkup = `
        <div class="main-forecast">
  <!-- Сегодня -->
  <div class="today-forecast">

    <h1>${data.location.name}</h1>
    <h2>Сегодня</h2>
    <div class="weather-today">
	   <div class="weather-item">
        <img id="today-icon" src="https://${dailyForecasts[0].icon_url}" alt="">
      </div>
      <div class="weather-item">
        <h4>Температура:</h4>
        <p id="today-temp">${dailyForecasts[0].temp_c}°C</p>
      </div>
      <div class="weather-item">
        <h4>Влажность:</h4>
        <p id="today-humidity">${dailyForecasts[0].humidity}%</p>
      </div>
      <div class="weather-item">
        <h4>М/с ветра:</h4>
        <p id="today-wind">${dailyForecasts[0].wind_kph} км/ч</p>
      </div>
    </div>
  </div>
  
  <!-- Остальные дни -->
  <div class="other-days-forecast">
    <h2>Прогноз на неделю</h2>
    <div class="days-container">
      ${dailyForecasts.slice(1).map((forecast, index) => `
        <div class="day-forecast">
          <h3>${forecast.date}</h3><br /><br />
			 <div class="weather-item">
            <img src="https://${forecast.icon_url}" alt="">
          </div>
          <div class="weather-item">
            <h4>Температура:</h4>
            <p>${forecast.temp_c}°C</p>
          </div>
          <div class="weather-item">
            <h4>Влажность:</h4>
            <p>${forecast.humidity}%</p>
          </div>
          <div class="weather-item">
            <h4>М/с ветра:</h4>
            <p>${forecast.wind_kph} км/ч</p>
          </div>
          
        </div>
      `).join('')}
    </div>
  </div>
</div>
      `;

			// Устанавливаем сформированную разметку в контейнер
			const weatherContainer = document.getElementById('weather-container');
			weatherContainer.innerHTML = weatherMarkup;
		})
		.catch(error => {
			console.error('Ошибка:', error);
			alert('Произошла ошибка при получении данных о погоде.');
		});
});