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

// Typing Effect for Contact Page
document.addEventListener("DOMContentLoaded", () => {
    const title = "Foulz Tweaks and Optimizations"; 
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

// Check Discord login status
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const discordToken = localStorage.getItem('discordToken'); 

    if (discordToken) {
        fetchUserData(discordToken);
    } else {
        userInfo.innerHTML = '<a href="/signin" class="nav-link">Sign In</a>';
    }
});

// Fetch user data from Discord API
function fetchUserData(token) {
    fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        if (data.username) {
            const username = `${data.username}#${data.discriminator}`;
            const userInfo = document.getElementById("user-info");

            // Update navbar with username
            userInfo.innerHTML = `<a href="#" class="nav-link">${username}</a>`;

            // Add logout button
            const logoutButton = document.createElement('li');
            logoutButton.classList.add("nav-link");
            logoutButton.innerText = "Log Out";
            logoutButton.addEventListener("click", logout);
            document.querySelector("nav ul").appendChild(logoutButton);
        } else {
            console.error('Username could not be found in the response', data);
        }
    })
    .catch(error => console.error('Error fetching user data:', error));
}

// Logout function: Removes token and reloads the page
function logout() {
    localStorage.removeItem('discordToken');
    window.location.reload();
}

// OAuth callback page handling
if (window.location.pathname === '/auth/discord/callback') {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');

    const clientId = '1354998845486010368';
    const clientSecret = 'ueyTXUBiKsLGK4rlOclDqpTvcnd-AyFt';
    const redirectUri = 'https://foulz.xyz/auth/discord/callback';

    async function exchangeCodeForToken(code) {
        try {
            const response = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri
                })
            });

            const data = await response.json();
            if (data.access_token) {
                localStorage.setItem('discordToken', data.access_token);
                window.location.href = '/'; // Redirect to home after login
            } else {
                alert('Login Failed: ' + JSON.stringify(data));
            }
        } catch (error) {
            alert('Error during token exchange: ' + error.message);
        }
    }

    if (authCode) {
        exchangeCodeForToken(authCode);
    } else {
        alert('Authorization Code Not Found');
    }
}
