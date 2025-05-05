// Get all navbar links
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        if (link.getAttribute('href').startsWith('#')) {
            event.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Typing effect
document.addEventListener("DOMContentLoaded", () => {
    const title = "ZYNWARE | Optimize, Bypass & Repair";
    const titleElement = document.getElementById("main-title");
    let i = 0;
    titleElement.textContent = '';

    function type() {
        if (i < title.length) {
            titleElement.innerHTML += title.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }

    type();
});

// Handle dynamic navbar updates based on login state
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const discordToken = localStorage.getItem('discordToken');
    const redeemLink = document.getElementById('redeem-link');

    if (discordToken) {
        fetchUserData(discordToken);
    } else {
        userInfo.innerHTML = '<a href="/signin" class="nav-link">Sign In</a>';
        if (redeemLink) redeemLink.style.display = 'none';
    }

    function fetchUserData(token) {
        fetch('https://discord.com/api/users/@me', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(response => response.json())
        .then(data => {
            const username = `${data.username}#${data.discriminator}`;
            userInfo.innerHTML = `<a href="#" class="nav-link">${username}</a>`;

            if (redeemLink) redeemLink.style.display = 'block';

            const logoutButton = document.createElement('li');
            logoutButton.classList.add("nav-link");
            logoutButton.innerText = "Log Out";
            logoutButton.addEventListener("click", logout);
            if (!document.querySelector("#logout-button")) {
                logoutButton.id = "logout-button";
                document.querySelector("nav ul").appendChild(logoutButton);
            }
        })
        .catch(error => console.log('Error fetching user data:', error));
    }

    function logout() {
        localStorage.removeItem('discordToken');
        window.location.reload();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const socialsSection = document.getElementById("socials");
    if (socialsSection) {
        socialsSection.style.display = "block";
        socialsSection.style.setProperty('display', 'block', 'important');
    }
});
