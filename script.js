// Get all navbar links
const navLinks = document.querySelectorAll('nav ul li a');

// Add click event listeners to each navbar link
navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        // Prevent the default anchor behavior (no jumping to sections)
        event.preventDefault();

        // Remove 'active' class from all links
        navLinks.forEach(link => link.classList.remove('active'));

        // Add 'active' class to the clicked link
        link.classList.add('active');

        // Optionally scroll to the section smoothly
        const targetId = link.getAttribute('href');
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typing Effect (Fix for Contact Page)
document.addEventListener("DOMContentLoaded", () => {
    const title = "Foulz Tweaks and Optimizations"; // Adjusted title for contact page
    const titleElement = document.getElementById("main-title");
    let i = 0;

    // Clear text content first to ensure correct re-rendering on each load
    titleElement.textContent = '';

    function type() {
        if (i < title.length) {
            titleElement.innerHTML += title.charAt(i); // Use innerHTML to handle more complex text rendering
            i++;
            setTimeout(type, 100); // Adjust speed by changing the delay (100ms)
        }
    }

    type();
});
