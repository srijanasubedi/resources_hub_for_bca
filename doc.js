// --- 1. Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Check localStorage for saved theme preference on page load
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Light Mode';
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update button text and save preference to localStorage
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️ Light Mode';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙 Dark Mode';
    }
});

// --- 2. Scrollspy Logic (Intersection Observer) ---
const sections = document.querySelectorAll('.content-section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.4 // Triggers when 40% of the section is visible in the viewport
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to the currently viewed section
            const id = entry.target.getAttribute('id');
            const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}, observerOptions);

// Observe all sections on the page
sections.forEach(section => observer.observe(section));

// --- 3. ADVANCED Search Filter Logic ---
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();

    sections.forEach(section => {
        // Find the section title and all the individual download cards inside it
        const sectionTitleElement = section.querySelector('h2');
        const sectionTitle = sectionTitleElement ? sectionTitleElement.textContent.toLowerCase() : "";
        const downloadItems = section.querySelectorAll('.download-item');
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        let hasVisibleItems = false; // Keep track if this section has any matching files

        // If the user searches for the subject name itself (e.g., "Network"), show all files in it
        if (sectionTitle.includes(searchTerm)) {
            hasVisibleItems = true;
            downloadItems.forEach(item => item.classList.remove('hidden'));
        } else {
            // Otherwise, check each individual file card one by one
            downloadItems.forEach(item => {
                const itemText = item.textContent.toLowerCase();
                
                if (itemText.includes(searchTerm)) {
                    item.classList.remove('hidden'); // Show this specific file
                    hasVisibleItems = true;          // Mark that we found at least one thing
                } else {
                    item.classList.add('hidden');    // Hide this specific file
                }
            });
        }

        // Finally, if the section has no matching files at all, hide the whole section and its sidebar link
        if (hasVisibleItems) {
            section.classList.remove('hidden');
            if (navLink) navLink.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
            if (navLink) navLink.classList.add('hidden');
        }
    });
});