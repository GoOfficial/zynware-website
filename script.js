// Get all navbar links
const navLinks = document.querySelectorAll('header nav ul li a');

// Loop through each link and add a click event listener
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add active class to the clicked link
        link.classList.add('active');
    });