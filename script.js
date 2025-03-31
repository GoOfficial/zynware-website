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

// Discord login status check (this can be extended later for actual login management)
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const discordToken = localStorage.getItem('discordToken'); // Fetch the token from localStorage

    // If the user is logged in (token exists in localStorage)
    if (discordToken) {
        fetchUserData(discordToken);
    } else {
        // If not logged in, show "Sign In" link
        userInfo.innerHTML = '<a href="/signin" class="nav-link">Sign In</a>';
    }

    // Get the current page's URL
    const currentPage = window.location.pathname;

    // Loop through all nav links and add the 'active' class to the current page's link
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Fetch user data from Discord API
function fetchUserData(token) {
    fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Update navbar with username
        const username = `${data.username}#${data.discriminator}`;
        const userInfo = document.getElementById("user-info");

        userInfo.innerHTML = `<a href="#" class="nav-link">${username}</a>`;

        // Add logout button
        const logoutButton = document.createElement('li');
        logoutButton.classList.add("nav-link");
        logoutButton.innerText = "Log Out";
        logoutButton.addEventListener("click", logout);
        document.querySelector("nav ul").appendChild(logoutButton);

        // Show the Redeem License Key form only if the user is logged in
        showRedeemForm(data.id);
    })
    .catch(error => console.log('Error fetching user data:', error));
}

// Show the redeem form if the user is logged in
function showRedeemForm(discordUserId) {
    const redeemSection = document.getElementById('redeem');
    redeemSection.style.display = 'block'; // Make the form visible

    // Handle the form submission for redeeming the license key
    document.getElementById('redeemForm').addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent the form from refreshing the page

        const licenseKey = document.getElementById('licenseKey').value;
        const messageDiv = document.getElementById('message');

        try {
            // Send the license key and user data to the server
            const response = await fetch('/api/redeem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key: licenseKey, discordUserId: discordUserId }),
            });

            if (response.ok) {
                const result = await response.text();
                messageDiv.style.color = 'lightgreen';
                messageDiv.textContent = result; // Display success message
            } else {
                const error = await response.text();
                messageDiv.style.color = 'red';
                messageDiv.textContent = error; // Display error message
            }
        } catch (err) {
            messageDiv.style.color = 'red';
            messageDiv.textContent = 'An error occurred. Please try again later.';
        }
    });
}

// Logout function: Removes token and reloads the page
function logout() {
    localStorage.removeItem('discordToken');
    window.location.reload();
}

// OAuth callback page handling (after user logs in via Discord OAuth)
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
            alert('Error during token exchange: ' + error);
        }
    }

    if (authCode) {
        exchangeCodeForToken(authCode);
    } else {
        alert('Authorization Code Not Found');
    }
}
