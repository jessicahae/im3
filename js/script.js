let weatherData = []; // Globale Variable für Wetterdaten
let selectedData = []; // gefilterte Daten nach Ort
let slideData = [];
let swiper = null;
let myChart = null;

fetch('https://mmp-im3.jessicahaeseli.ch/php/unload.php')
    .then(response => response.json())
    .then(data => {
        weatherData = data;
        filterWeatherData('Bern');
        filterByTimestamp();
        createSlides();
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Grundfunktionen Swiper Page
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('#startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            window.location.href = 'slides.html';
        });
    }
    if (typeof Swiper !== 'undefined' && document.querySelector('#swiper-container')) {

        swiper = new Swiper('#swiper-container', {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            mousewheel: true,
            keyboard: { enabled: true },
            navigation: {
                nextEl: '#swiper-button-next',
                prevEl: '#swiper-button-prev',
            },
            on: {
                slideChange: function () {
                },
                speed: 700,
                rtl: true,
            }
        });
    }
});

// Graphic Button Event Listener
const graphicButton = document.querySelector('#graphic_button');
const dateOverlayPage = document.querySelector('#date_overlay_page');
const slideContainer = document.querySelector('#swiper-container');
const overlayContainer = document.querySelector('#overlay');
const diagramPage = document.querySelector('#diagram_page');
const dateSelectorPage = document.querySelector('#date_selector_page');

if (graphicButton) {
    graphicButton.addEventListener('click', () => {
        if (slideContainer) slideContainer.style.display = 'none';
        if (overlayContainer) overlayContainer.style.display = 'none';
        if (diagramPage) diagramPage.style.display = 'none';
        if (dateOverlayPage) dateOverlayPage.style.display = 'none';
        if (dateSelectorPage) dateSelectorPage.style.display = 'flex';
    });
}

// Dropdown Event Listener & neue Daten laden

function filterWeatherData(city) {
    let locationId;
    switch (city.toLowerCase()) {
        case 'bern':
            locationId = 1;
            break;
        case 'zürich':
            locationId = 2;
            break;
        case 'geneva':
        case 'genf':
            locationId = 3;
            break;
        default:
            locationId = null;
    }

    if (locationId !== null) {
        selectedData = weatherData.filter(entry => entry.location_id === locationId);
        console.log(`🌆 ${city} (ID ${locationId}) → gefilterte Daten:`, selectedData);
    }
}

document.querySelectorAll('.dropdown_content li').forEach((item) => {
    item.addEventListener('click', () => {
        const city = item.textContent.trim();
        document.querySelector('#dropdown_button').textContent = city + ' ▼';
        filterWeatherData(city);
        filterByTimestamp();
        createSlides();
    });
});

// Swiper Slides erstellen basierend wechselnden Attributen

const timeSteps = ["07:00:00", "12:00:00", "20:00:00"];
const daysToShow = 14;

const now = new Date();
let lastStepIndex = timeSteps.findIndex(t => now.getHours() < parseInt(t));
lastStepIndex = lastStepIndex === -1 ? timeSteps.length - 1 : Math.max(0, lastStepIndex - 1);

const allTimestamps = [];
// 🔹 Alle Zeitpunkte (rückwärts) vorbereiten
for (let d = 0; d < daysToShow; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    for (let t = lastStepIndex; t >= 0; t--) allTimestamps.push(`${date.toISOString().split("T")[0]} ${timeSteps[t]}`);
    for (let t = timeSteps.length - 1; t > lastStepIndex; t--) {
        const prevDate = new Date(date);
        prevDate.setDate(prevDate.getDate() - 1);
        allTimestamps.push(`${prevDate.toISOString().split("T")[0]} ${timeSteps[t]}`);
    }
}
console.log("✅ Alle möglichen Zeitschritte:", allTimestamps);

function filterByTimestamp() {
    slideData = selectedData.filter(entry => {
        const timestamps = allTimestamps.map(timestamp => {
            return timestamp.substring(0, timestamp.length - 5);
        });
        return timestamps.includes(entry.current_timecode.substring(0, entry.current_timecode.length - 5));
    }).reverse();
    createSlides();
    console.log("✅ Gefilterte Zeitschritte mit Daten:", slideData);
}

function createSlides() {
    const container = document.querySelector('#swiper-bundle');
    if (!container) return;
    container.innerHTML = '';
    slideData.forEach(entry => {
        const time = entry.current_timecode.substring(11, 16);
        const rain = entry.rain;
        const isBadWeather = rain > 0.5;
        let dayPart = '';
        let imageSrc = '';
        let positionClass = '';

        if (time.startsWith('07')) {
            dayPart = 'morning';
            if (isBadWeather) {
                imageSrc = 'img/Moon.svg';
                positionClass = 'bottom_right';
            } else {
                imageSrc = 'img/Sun_pink.svg';
                positionClass = 'bottom_right';
            }
        } else if (time.startsWith('12')) {
            dayPart = 'noon';
            if (isBadWeather) {
                imageSrc = 'img/Cloud.svg';
                positionClass = 'center';
            } else {
                imageSrc = 'img/Sun_yellow.svg';
                positionClass = 'center';
            }
        } else if (time.startsWith('20')) {
            dayPart = 'evening';
            if (isBadWeather) {
                imageSrc = 'img/Moon.svg';
                positionClass = 'top_left';
            } else {
                imageSrc = 'img/Sun_pink.svg';
                positionClass = 'top_left';
            }
        } else return; // kein Match → ignorieren

        const weatherType = isBadWeather ? 'badweather' : 'goodweather';
        const sectionId = `${dayPart}_${weatherType}`;

        const date = new Date(entry.current_timecode);
        const formattedDate = date.toLocaleDateString('en-CH', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const formattedTime = date.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });
        const dayName = date.toLocaleDateString('en-CH', { weekday: 'long' });


        const template = `<section id="${sectionId}" class="swiper-slide page">
              <img class="sun ${positionClass}" src="${imageSrc}" alt="${weatherType === 'goodweather' ? 'sun' : 'cloud'}">
              <div class="time">${formattedTime}</div>

              <div class="central_content">

              <div class="weather_container">

                    <div class="day"> 
                        <span class="big_header">${dayName},</span>
                        <span class="weather_info"> It was ${entry.weather_code}</span>
                    </div>
                    <div class="temperature"> ${entry.temperature}</div>
                </div>


                <div class="weatherdata_container">
                    <div class="weather_data"><span class="weather_label">wind</span><span class="weather_value">${entry.windspeed}km/h</span></div>
                    <div class="weather_data"><span class="weather_label">humidity</span><span class="weather_value">${entry.humidity}%</span></div>
                    <div class="weather_data"><span class="weather_label">rain</span><span class="weather_value">${entry.rain}mm</span></div>
                    <div class="weather_data"><span class="weather_label">cloud cover</span><span class="weather_value">${entry.cloud_cover}%</span>
                </div>
                </div>

                    <div class="date">
                    <span class="calendar_button"><div class="calendar_icon"></div></span>
                    <span class="date_label">${formattedDate}</span>  
                    </div>
                </div>
            </section>`;
        container.innerHTML += template;

    });
    swiper.update();

    document.querySelectorAll('.calendar_button').forEach(btn => {
        btn.addEventListener('click', () => {
            if (slideContainer) slideContainer.style.display = 'none';
            if (diagramPage) diagramPage.style.display = 'none';
            if (dateSelectorPage) dateSelectorPage.style.display = 'none';
            if (overlayContainer) overlayContainer.style.display = 'none';

            // NUR Slider-Input anzeigen
            if (dateOverlayPage) dateOverlayPage.style.display = 'flex';
        });
    });
}

// Kalender Overlay Event Listener und Slides neu filtern

const sliderNextBtn = document.querySelector('#nextButton');

if (sliderNextBtn) {
    sliderNextBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const dateVal = document.querySelector('#fromDate').value;
        if (!dateVal) return alert("Bitte Datum wählen.");

        const end = new Date(dateVal);
        end.setHours(23, 59, 59, 999);

        const start = new Date(end);
        start.setDate(start.getDate() - 14);
        start.setHours(0, 0, 0, 0);

        let rawData = selectedData.filter(e => {
            const d = new Date(e.current_timecode);
            return d >= start && d <= end;
        });

        const validTimes = ["07:00:00", "12:00:00", "20:00:00"];
        slideData = rawData.filter(e => {
            const timePart = e.current_timecode.split(' ')[1];
            return timePart.startsWith('07') || timePart.startsWith('12') || timePart.startsWith('20');
        }).reverse();

        if (!slideData.length) return alert("Keine Wetterdaten für diesen Zeitraum.");

        createSlides();

        if (dateOverlayPage) dateOverlayPage.style.display = 'none';
        if (slideContainer) slideContainer.style.display = 'block';
        if (overlayContainer) overlayContainer.style.display = 'flex';

        if (swiper) {
            swiper.update();
            swiper.slideTo(0, 0);
        }
    });
}

// Grafik Seite laden & Diagramm erstellen

const chartNextBtn = document.querySelector('#next_diagram_Button');
const chartDateDisplay = document.querySelector('#chart_date_display');

if (chartNextBtn) {
    chartNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const fromVal = document.querySelector('#chartFromDate').value;
        const toVal = document.querySelector('#chartToDate').value;

        if (!fromVal || !toVal) return alert("Bitte Zeitraum wählen.");
        if (fromVal > toVal) return alert("Startdatum muss vor Enddatum liegen.");

        if (chartDateDisplay) {
            const fromDateObj = new Date(fromVal);
            const toDateObj = new Date(toVal);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };

            chartDateDisplay.textContent = `${fromDateObj.toLocaleDateString('en-US', options)} to ${toDateObj.toLocaleDateString('en-US', options)}`;
        }

        const rawData = selectedData.filter(e => {
            const d = e.current_timecode.split(' ')[0];
            return d >= fromVal && d <= toVal;
        });

        if (!rawData.length) return alert("Keine Daten in diesem Zeitraum.");

        const dailySums = {};

        rawData.forEach(entry => {
            const dateStr = entry.current_timecode.split(' ')[0];

            if (!dailySums[dateStr]) {
                dailySums[dateStr] = {
                    temp: 0, rain: 0, wind: 0, hum: 0, cloud: 0, count: 0
                };
            }

            dailySums[dateStr].temp += parseFloat(entry.temperature);
            dailySums[dateStr].rain += parseFloat(entry.rain);
            dailySums[dateStr].wind += parseFloat(entry.windspeed);
            dailySums[dateStr].hum += parseFloat(entry.humidity);
            dailySums[dateStr].cloud += parseFloat(entry.cloud_cover);
            dailySums[dateStr].count++;
        });

        const averagedData = Object.keys(dailySums).map(dateKey => {
            const day = dailySums[dateKey];
            return {
                current_timecode: dateKey,
                temperature: (day.temp / day.count).toFixed(1),
                rain: (day.rain / day.count).toFixed(1),
                windspeed: (day.wind / day.count).toFixed(1),
                humidity: (day.hum / day.count).toFixed(0),
                cloud_cover: (day.cloud / day.count).toFixed(0)
            };
        }).sort((a, b) => new Date(a.current_timecode) - new Date(b.current_timecode));

        renderChart(averagedData);

        if (dateSelectorPage) dateSelectorPage.style.display = 'none';
        if (diagramPage) diagramPage.style.display = 'flex';
        if (overlayContainer) overlayContainer.style.display = 'none';
    });
}

// Diagramm anhand Zeitperiode laden

function renderChart(data) {
    const ctx = document.getElementById('myWeatherChart');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        data: {

            labels: data.map(d => {
                const date = new Date(d.current_timecode);
                return `${date.getDate()}.${date.getMonth() + 1}.`;
            }),
            datasets: [
                { type: 'bar', label: 'Rain (mm)', data: data.map(d => d.rain), yAxisID: 'y', backgroundColor: '#36A2EB' },
                { type: 'line', label: 'Temp (°C)', data: data.map(d => d.temperature), yAxisID: 'y', borderColor: '#FF6384', borderWidth: 2 },
                { type: 'line', label: 'Wind (km/h)', data: data.map(d => d.windspeed), yAxisID: 'y', borderColor: '#FFCE56', hidden: true },
                { type: 'line', label: 'Humidity (%)', data: data.map(d => d.humidity), yAxisID: 'y1', borderColor: '#4BC0C0', hidden: true },
                { type: 'line', label: 'Clouds (%)', data: data.map(d => d.cloud_cover), yAxisID: 'y1', borderColor: '#9966FF', hidden: true }
            ]
        },
        options: {
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: { type: 'linear', position: 'left', beginAtZero: true, title: { display: true, text: 'Messwerte (°C / mm / km/h)' } },
                y1: { type: 'linear', position: 'right', min: 0, max: 100, grid: { drawOnChartArea: false }, title: { display: true, text: 'Prozent %' } }
            }
        }
    });
}

// Universal close buttons

document.querySelectorAll('.close_button').forEach(btn => {
    btn.addEventListener('click', () => {
        if (diagramPage) diagramPage.style.display = 'none';
        if (dateSelectorPage) dateSelectorPage.style.display = 'none';
        if (dateOverlayPage) dateOverlayPage.style.display = 'none';
        if (slideContainer) slideContainer.style.display = 'block';
        if (overlayContainer) overlayContainer.style.display = 'flex';
        if (swiper) {
            swiper.update();
        }
    });
});