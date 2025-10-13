console.log("Hello, World!");

fetch('https://mmp-im3.jessicahaeseli.ch/php/unload.php')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
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



