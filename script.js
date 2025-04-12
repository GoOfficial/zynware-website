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
    const title = "ZYNWARE | Optimize, Bypass & Repair"; // Adjusted title for contact page
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

// Handle dynamic navbar updates based on login state
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById("user-info");
    const discordToken = localStorage.getItem('discordToken');
    const redeemLink = document.getElementById('redeem-link');

    // If the user is logged in (token exists in localStorage)
    if (discordToken) {
        // Fetch user data from Discord API
        fetchUserData(discordToken);
    } else {
        // If not logged in, show "Sign In" link and hide "Redeem License Key" link
        userInfo.innerHTML = '<a href="/signin" class="nav-link">Sign In</a>';
        redeemLink.style.display = 'none'; // Hide the "Redeem License Key" link
    }

    // Function to fetch user data from Discord
    function fetchUserData(token) {
        fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const username = `${data.username}#${data.discriminator}`;
            userInfo.innerHTML = `<a href="#" class="nav-link">${username}</a>`;

            // Show the "Redeem License Key" link
            redeemLink.style.display = 'block';

            // Add a logout button if not already added
            const logoutButton = document.createElement('li');
            logoutButton.classList.add("nav-link");
            logoutButton.innerText = "Log Out";
            logoutButton.addEventListener("click", logout);
            // Avoid adding multiple logout buttons
            if (!document.querySelector("#logout-button")) {
                logoutButton.id = "logout-button";
                document.querySelector("nav ul").appendChild(logoutButton);
            }
        })
        .catch(error => console.log('Error fetching user data:', error));
    }

    // Logout function: Removes token and reloads the page
    function logout() {
        localStorage.removeItem('discordToken');
        window.location.reload();
    }
});

// Discord OAuth callback page handling (after user logs in via Discord OAuth)
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

document.addEventListener("DOMContentLoaded", () => {
    const socialsSection = document.getElementById("socials");

    if (socialsSection) {
        socialsSection.style.display = "block";  // Forces display to block
        socialsSection.style.setProperty('display', 'block', 'important');  // Apply !important dynamically
        
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.querySelector('.dropdown');
    const toggle = dropdown.querySelector('.dropdown-toggle');

    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
    });

    // Optional: close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove('open');
        }
    });
});
