// Function to fetch and inject content from JSON
async function fetchAndInjectContent(jsonUrl) {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Wait for DOM to load before injecting the Top Bar
        document.addEventListener("DOMContentLoaded", () => {
            injectTopBar(data['top-bar'].default);
        });

        // Handle Cards Injection (these load immediately)
        injectCard(data['card-accent'].default, 'ctaAccentCardLink');
        injectCard(data['card-white'].default, 'ctaWhiteCardLink');
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// Function to inject the Top Bar content
function injectTopBar(topBarContent) {
    // Ensure the marker is created at the top
    const marker = document.createElement('div');
    marker.id = 'top-bar-injection-point';
    document.body.insertBefore(marker, document.body.firstChild);

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = topBarContent.css;
    document.head.appendChild(style);

    // Inject HTML into the marker
    const injectionPoint = document.getElementById('top-bar-injection-point');
    if (injectionPoint) {
        injectionPoint.outerHTML = topBarContent.html;

        // Populate Text Content
        const textElement = document.getElementById('top-bar-text');
        if (textElement) {
            textElement.textContent = topBarContent.text;
        }

        // Populate Button Content
        const buttonElement = document.getElementById('top-bar-button');
        if (buttonElement) {
            buttonElement.href = topBarContent.link;
            buttonElement.textContent = topBarContent.button;
        }
    } else {
        console.error("Top bar injection point not found.");
    }
}

// Function to inject Card content
function injectCard(cardContent, cardLinkId) {
    const cardLink = document.getElementById(cardLinkId);
    if (cardLink) {
        // Update card link
        cardLink.href = cardContent.cardLink;

        // Update logo
        const logo = document.getElementById(`${cardLinkId.replace('Link', 'Logo')}`);
        if (logo) {
            logo.src = cardContent.logoURL;
            logo.removeAttribute('srcset');
        }

        // Update title
        const title = document.getElementById(`${cardLinkId.replace('Link', 'Title')}`);
        if (title) title.textContent = cardContent.title;

        // Update paragraph
        const paragraph = document.getElementById(`${cardLinkId.replace('Link', 'Paragraph')}`);
        if (paragraph) paragraph.textContent = cardContent.paragraph;

        // Update button text
        const buttonText = document.getElementById(`${cardLinkId.replace('Link', 'ButtonText')}`);
        if (buttonText) buttonText.textContent = cardContent.buttonText;

        // Update main image
        const image = cardLink.querySelector('.cta-card-image');
        if (image) {
            image.src = cardContent.imageURL;
            image.removeAttribute('srcset');
            image.removeAttribute('sizes');
        }
    }
}

// Main execution
(function() {
    const jsonUrl = window.copyConfig && window.copyConfig.jsonUrl
        ? window.copyConfig.jsonUrl
        : 'https://clonables-copy-git-main-brix-templates-projects.vercel.app/clonables-copy.json';

    fetchAndInjectContent(jsonUrl);
})();
