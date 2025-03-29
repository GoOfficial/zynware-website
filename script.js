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

// Check if the user is logged in
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const discordToken = localStorage.getItem('discordToken'); // Or sessionStorage
    const logoutButton = document.createElement("li");

    // If user is logged in, update navbar
    if (discordToken) {
        fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${discordToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const username = `${data.username}#${data.discriminator}`;

            // Update user info
            userInfo.innerHTML = `<a href="#">${username}</a>`;
            userInfo.classList.add("user-name"); // Add any styling class

            // Create a logout button
            logoutButton.classList.add("nav-link");
            logoutButton.innerText = "Log Out";
            logoutButton.addEventListener("click", () => {
                // Log out process: Remove token and reload page
                localStorage.removeItem('discordToken');
                window.location.reload();
            });

            const navbar = document.querySelector('nav ul');
            navbar.appendChild(logoutButton); // Add the logout button
        })
        .catch(error => console.log("Error fetching user data:", error));
    } else {
        // If not logged in, ensure Sign In button is visible
        userInfo.innerHTML = `<a href="/signin" class="nav-link">Sign In</a>`;
    }
});

// Only run the OAuth code on the /auth/discord/callback page
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
                fetchUserData(data.access_token);
            } else {
                alert('Login Failed: ' + JSON.stringify(data));
            }
        } catch (error) {
            alert('Error during token exchange: ' + error);
        }
    }

    async function fetchUserData(token) {
        try {
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const userData = await userResponse.json();
            alert(`Welcome, ${userData.username}#${userData.discriminator}!`);
            window.location.href = '/';
        } catch (error) {
            alert('Error fetching user data: ' + error);
        }
    }

    // If there's a code, exchange it for a token
    if (authCode) {
        exchangeCodeForToken(authCode);
    } else {
        alert('Authorization Code Not Found');
    }
}
