const hamburgerButton = document.querySelector('.hamburger-button');
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');
const closeButton = document.querySelector('.close-button');
const toggleLabel = document.querySelector('.toggle-label');
const toggleInput = document.querySelector('.toggle');

hamburgerButton.addEventListener('click', () => {
  mobileMenu.classList.add('show');
  hamburgerButton.classList.add('.show');
  navMenu.classList.add('nav-show');
  toggleLabel.classList.add('toggle-label-show');
  toggleInput.classList.add('toggle-label-show');
});
closeButton.addEventListener('click', () => {
  mobileMenu.classList.remove('show');
  hamburgerButton.classList.remove('.show');
  navMenu.classList.remove('nav-show');
  toggleLabel.classList.remove('toggle-label-show');
  toggleInput.classList.remove('toggle-label-show');
});
toggleInput.addEventListener('change', () => {
  if (toggleInput.checked) {
    document.body.setAttribute('data-theme', 'dark');
    mobileMenu.classList.add('mobile-menu-color');
  } else {
    document.body.setAttribute('data-theme', 'light');
    mobileMenu.classList.remove('mobile-menu-color');
  }
});
