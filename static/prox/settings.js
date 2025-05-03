
const beforeUnloadEnabled = localStorage.getItem('beforeUnloadEnabled') === 'true';
if (beforeUnloadEnabled) {
    window.addEventListener('beforeunload', (e) => {
        e.preventDefault();
        e.returnValue = '';
    });
}

const savedTitle = localStorage.getItem('siteTitle');
if (savedTitle) {
    document.title = savedTitle;
}

const savedLogo = localStorage.getItem('siteLogo');
if (savedLogo) {
    const logoElement = document.querySelector('link[rel="icon"]'); 
    if (logoElement) {
        logoElement.href = savedLogo;
    }
}

const panicKey = localStorage.getItem('panicKey');
const panicUrl = localStorage.getItem('panicUrl');
if (panicKey && panicUrl) {
    window.addEventListener('keydown', (event) => {
        if (event.key === panicKey) {
            window.location.href = panicUrl;
        }
    });
}

const autocloak = localStorage.getItem('autocloakEnabled') === 'true';
if (autocloak) {
        window.onload = () => {
            const newTab = window.open('about:blank', '_blank');
            if (!newTab) {
                alert("Please enable popups to proceed.");
                return;
            }

            const siteTitle = localStorage.getItem('siteTitle') || "Home";
            const siteLogo = localStorage.getItem('siteLogo') || "https://raw.githubusercontent.com/voucan/voucan.github.io/refs/heads/main/googleclassroom.png";

            newTab.document.title = siteTitle;

            const favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.href = siteLogo;
            newTab.document.head.appendChild(favicon);

            const iframe = document.createElement('iframe');
            iframe.src = '/';
            iframe.style.width = '100vw';
            iframe.style.height = '100vh';
            iframe.style.border = 'none';
            newTab.document.body.style.margin = '0';
            newTab.document.body.appendChild(iframe);

            const panicUrl = localStorage.getItem('panicUrl') || "https://classroom.google.com";
            window.location.href = panicUrl;
        };
