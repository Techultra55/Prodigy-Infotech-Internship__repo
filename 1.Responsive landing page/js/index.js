// Mobile Menu Toggle

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', ()=>{
    navMenu.classList.toggle('active');
})

// Close mobile menu when clicking on a link

const navLinks = document.querySelectorAll('.nav-links li a');

navLinks.forEach(link =>{
    link.addEventListener('click',()=>{
        navMenu.classList.remove('active');
    });
})