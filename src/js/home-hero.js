import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const orderNowButton = document.querySelector('.order-now-button');
const orderNowArea = document.querySelector('.order-now');
const closeButton = document.querySelector('.order-now-close-button');

const swiper = new Swiper('.swiper', {
  slidesPerView: 'auto',
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
});

orderNowButton.addEventListener('click', () => {
  orderNowArea.classList.add('show-order-now');
});
closeButton.addEventListener('click', () => {
  orderNowArea.classList.remove('show-order-now');
});
