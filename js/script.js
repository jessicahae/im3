let weatherData = []; // Globale Variable für Wetterdaten
let selectedData = []; // gefilterte Daten nach Ort
let slideData = [];
let swiper = null;

fetch('https://mmp-im3.jessicahaeseli.ch/php/unload.php')
  .then(response => response.json())
  .then(data => {
    weatherData = data; // Globale Variable aktualisieren
    filterWeatherData('Bern'); // Standardmäßig Bern auswählen
    filterByTimestamp();
    createSlides();
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });


document.addEventListener('DOMContentLoaded', () => {
  // Startbutton
  const startButton = document.querySelector('#startButton');
  if (startButton) {
    startButton.addEventListener('click', () => {
      window.location.href = 'slides.html';
    });
  }

  // Swiper nur initialisieren, wenn es den Container gibt
  if (document.querySelector('#swiper-container')) {
    // Swiper muss bereits geladen sein (nur auf slides.html)
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
          updateSlide(this.activeIndex);
        },
        speed: 700,
        rtl: true,
      }
    });
  }
});


const graphicButton = document.querySelector('#graphic_button');
const dateSelectorPage = document.querySelector('#date_selector_page');
const slideContainer = document.querySelector('#swiper-container');
const overlayContainer = document.querySelector('#overlay');
graphicButton.addEventListener('click', () => {
  dateSelectorPage.style.display = 'block';
  slideContainer.style.display = 'none';
  overlayContainer.style.display = 'none';
});


const nextButton = document.querySelector('#next_diagram_Button');
const diagramPage = document.querySelector('#diagram_page');
nextButton.addEventListener('click', () => {
  diagramPage.style.display = 'block';
  dateSelectorPage.style.display = 'none';
});





// Dropdown Event Listener

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
  container.innerHTML = '';
  slideData.forEach(entry => {
    const time = entry.current_timecode.substring(11, 16);
    const rain = entry.rain;
    const isBadWeather = rain > 2;
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
    /*const time = entry.current_timecode.substring(11, 16); // z. B. "07:00"
    const rain = entry.rain;
    const isBadWeather = rain > 2;

    // Zeitabschnitt bestimmen
    let dayPart = '';
    if (time.startsWith('07')) dayPart = 'morning';
    else if (time.startsWith('12')) dayPart = 'noon';
    else if (time.startsWith('20')) dayPart = 'evening';
    else return; // kein Match → ignorieren

    const weatherType = isBadWeather ? 'badweather' : 'goodweather';
    const sectionId = `#${dayPart}_${weatherType}`;
    const section = document.querySelector(sectionId);
    if (!section) return;

    // 🔹 Inhalte aktualisieren
    const date = new Date(entry.current_timecode);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    section.querySelector('.time').textContent = formattedTime;
    section.querySelector('.temperature').textContent = entry.temperature;
    section.querySelector('.weather_info').textContent = `– ${entry.weather_code}`;
    section.querySelector('.day h1').textContent = dayName;
    section.querySelector('.date_label').textContent = formattedDate;

    const rows = section.querySelectorAll('.weather_data');
    if (rows.length >= 3) {
      rows[0].querySelector('span:nth-child(2)').textContent = `${entry.windspeed} km/h`;
      rows[1].querySelector('span:nth-child(2)').textContent = `${entry.humidity}%`;
      rows[2].querySelector('span:nth-child(2)').textContent = `${entry.rain} mm`;
    }*/
  });
  swiper.update();
  const calendarButtons = document.querySelectorAll('.calendar_button');
  const dateOverlayPage = document.querySelector('#date_overlay_page');
  calendarButtons.forEach(button => {
    button.addEventListener('click', () => {
      dateOverlayPage.style.display = 'block';
      slideContainer.style.display = 'none';
      overlayContainer.style.display = 'block';
    });
  });
}
