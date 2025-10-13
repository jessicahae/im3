/* console.log("Hello, World!");

fetch('https://mmp-im3.jessicahaeseli.ch/php/unload.php')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });


const startButton = document.querySelector('#startButton');

startButton.addEventListener('click', () => {
  // Weiterleitung zu slides.html
  window.location.href = 'slides.html';
});



const swiper = new Swiper('#swiper-container', {
  direction: 'horizontal',
  slidesPerView: 1,
  spaceBetween: 0,
  centeredSlides: true,
  mousewheel: true,
  keyboard: {
    enabled: true,
  },
  navigation: {
    nextEl: '#swiper-button-next',
    prevEl: '#swiper-button-prev',
  },
  speed: 700,
  rtl: true,
});
 */


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
      new Swiper('#swiper-container', {
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
        speed: 700,
        rtl: true,
      });
    }
  });


  

  const graphicButton = document.querySelector('#graphic_button');
  const dateSelector = document.querySelector('#date_selector_page');
  const slideContainer = document.querySelector('#swiper-container');
    graphicButton.addEventListener('click', () => {
      console.log("halle");
      dateSelector.style.display = 'block';
      slideContainer.style.display = 'none';
    });

