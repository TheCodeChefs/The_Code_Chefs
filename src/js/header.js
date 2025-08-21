console.log('Header script loaded');
const hamburgerButton = document.querySelector('.hamburger-button');
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');

hamburgerButton.addEventListener('click', () => {
  mobileMenu.classList.add('show');
  hamburgerButton.classList.add('.show');
  navMenu.classList.add('show');
});
