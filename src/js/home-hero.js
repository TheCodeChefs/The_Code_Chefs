import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

const orderNowButton = document.querySelector('.order-now-button');
const orderNowArea = document.querySelector('.order-now');
const closeButton = document.querySelector('.order-now-close-button');

const swiper = new Swiper('.swiper', {
  slidesPerView: 'auto',
  centeredSlides: false,
  spaceBetween: 16,
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
