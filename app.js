// Content management and navigation
const docs = {
    content: {}
}

const allDocsContent = {}; // To store all fetched documentation content for search

// Function to get all section IDs from the sidebar navigation
function getAllSectionIds() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const sectionIds = Array.from(navLinks).map(link => link.getAttribute('href').substring(1));
    return sectionIds;
}

// Preload all documentation content for search purposes
async function preloadAllContentForSearch() {
    const sectionIds = getAllSectionIds();
    for (const sectionId of sectionIds) {
        // Only load if not already in allDocsContent (to avoid re-fetching what's already displayed)
        if (!allDocsContent[sectionId]) {
            await loadContent(sectionId, true); // Pass true to indicate preloading for search
        }
    }
}

async function fetch_g_version() {
    let version = await fetch("https://api.github.com/repos/lucop1911/g-lang/releases/latest")
        .then(response => response.json())
        .then(data => data.tag_name)
        .catch(e => {
            console.log(e)
            return "Unable to fetch version";
        })
    return version;
}

async function insert_version_to_html() {
    const version = await fetch_g_version();
    const v_element = document.getElementById("version");
    v_element.innerHTML = version;
}

// Navigation handling
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            navigateToSection(targetId);
        });
    });

    // Handle initial load or hash change
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1) || 'intro';
        navigateToSection(hash);
    });

    // Load initial section
    const initialSection = window.location.hash.substring(1) || 'intro';
    navigateToSection(initialSection);
}

function navigateToSection(sectionId) {
    // Update active section
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        window.location.hash = sectionId;
        window.scrollTo(0, 0);
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });

    // Load content if not already loaded
    if (!docs.content[sectionId]) {
        loadContent(sectionId);
    }

    // Close mobile menu after navigation
    if (window.innerWidth <= 768) {
        toggleMobileMenu(true); 
    }
}

async function loadContent(sectionId, forSearchPreload = false) {
    const section = document.getElementById(sectionId);
    if (!section && !forSearchPreload) return; // Only return if not preloading and element doesn't exist

    let contentPath = ``;
    const subdirectories = ['Builtins', 'Guide', 'Introduction', 'Stdlib', 'Reference'];
    let found = false;

    for (const sub of subdirectories) {
        const testPath = `content/${sub}/${sectionId}.js`;
        try {
            const response = await fetch(testPath, { method: 'HEAD' });
            if (response.ok) {
                contentPath = testPath;
                found = true;
                break;
            }
        } catch (e) {
            // Continue to next subdirectory if head request fails
        }
    }

    if (!found) {
        contentPath = `content/${sectionId}.js`;
        try {
            const response = await fetch(contentPath, { method: 'HEAD' });
            if (!response.ok) {
                throw new Error('Content not found in root content folder');
            }
        } catch (e) {
            contentPath = '';
        }
    }

    if (!contentPath) {
        if (!forSearchPreload) { // Only render error if not preloading
            section.innerHTML = `
                <h1>Content Not Found</h1>
                <p>The documentation for this section is being written. Check back soon!</p>
                <div class="alert alert-info">
                    <strong>Note:</strong> The content for this section could not be found.
                </div>
            `;
        }
        return;
    }

    try {
        const response = await fetch(contentPath);
        if (!response.ok) throw new Error('Content not found');
        
        const contentModule = await response.text();
        const contentFunc = new Function('return ' + contentModule)();
        const html = contentFunc();
        
        if (!forSearchPreload) { // Only render to DOM if not preloading
            section.innerHTML = html;
            docs.content[sectionId] = html; // Cache the full HTML content
            highlightCode();
        }
        cacheContent(sectionId, html); // Always cache for search, regardless of preloading
    } catch (error) {
        console.error(`Error loading content for ${sectionId}:`, error);
        if (!forSearchPreload) { // Only render error if not preloading
            section.innerHTML = `
                <h1>Content Not Found</h1>
                <p>The documentation for this section is being written. Check back soon!</p>
                <div class="alert alert-info">
                    <strong>Note:</strong> This is a modular documentation system. 
                    Error loading content from <code>${contentPath}</code>
                </div>
            `;
        }
    }
}

function cacheContent(sectionId, htmlContent) {
    // Check if content already cached to avoid redundant processing
    if (allDocsContent[sectionId] && allDocsContent[sectionId].functionNames && allDocsContent[sectionId].functionNames.length > 0) {
        return; 
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const titleElement = tempDiv.querySelector('h1, h2');
    const title = titleElement ? titleElement.textContent : sectionId.replace(/-/g, ' ');

    // Extract function/method names from signatures
    const functionSignatures = Array.from(tempDiv.querySelectorAll('.function-signature'))
                                   .map(el => {
                                       // Extract text and clean it
                                       let signatureText = el.textContent.trim();
                                       // Use regex to get just the function/method name(s)
                                       // Matches word characters before '(' or before '()' or after '.'
                                       let names = [];
                                       let match;

                                       // For "head(array) / .head() → Any" or "push(array, value) / .push(value) → Array"
                                       const complexSignatureRegex = /(\b[a-zA-Z_][a-zA-Z0-9_]*)\(.*?\) \/ \.(\b[a-zA-Z_][a-zA-Z0-9_]*)\(.*\)/;
                                       if ((match = signatureText.match(complexSignatureRegex)) !== null) {
                                           names.push(match[1]);
                                           names.push(match[2]);
                                       } else {
                                           // For ".get(index) → Any" or "cons(value, array) → Array" or ".len() → Integer"
                                           const simpleSignatureRegex = /(?:\.|^)(\b[a-zA-Z_][a-zA-Z0-9_]*)(?:\(|$)/g;
                                           while ((match = simpleSignatureRegex.exec(signatureText)) !== null) {
                                               names.push(match[1]);
                                           }
                                       }
                                       return names;
                                   })
                                   .flat()
                                   .filter(name => name.length > 0) // Remove any empty strings
                                   .map(name => name.toLowerCase()); // Convert to lowercase for search
    allDocsContent[sectionId] = {
        id: sectionId,
        title: title,
        functionNames: Array.from(new Set(functionSignatures)), // Ensure unique names
        content: "" // Clear content as per new requirement
    };
}

let selectedResultIndex = -1; // To track the currently selected search result

function performSearch(query) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';
    selectedResultIndex = -1; // Reset selection on new search

    if (query.trim() === '') {
        return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const results = [];

    for (const sectionId in allDocsContent) {
        const doc = allDocsContent[sectionId];
        let matchFound = false;
        let matchType = ''; // To indicate if match is in title, id, or function name
        let matchedFunctionName = ''; // To store the specific function name that matched

        // Search in section ID
        if (doc.id.includes(lowerCaseQuery)) {
            matchFound = true;
            matchType = 'Page ID';
        }
        
        // Search in title
        if (!matchFound && doc.title.toLowerCase().includes(lowerCaseQuery)) {
            matchFound = true;
            matchType = 'Page Title';
        }

        // Search in function names
        if (!matchFound && doc.functionNames && doc.functionNames.length > 0) {
            for (const funcName of doc.functionNames) {
                if (funcName.includes(lowerCaseQuery)) {
                    matchFound = true;
                    matchType = 'Function/Method Name';
                    matchedFunctionName = funcName;
                    break;
                }
            }
        }

        if (matchFound) {
            // Add a small snippet for context, prioritizing function name if matched there
            let snippet = '';
            if (matchType === 'Function/Method Name') {
                snippet = `Match in function: <code>${matchedFunctionName}</code>`;
            } else {
                snippet = `Match in ${matchType}: "${doc.title}"`;
            }
            results.push({ ...doc, snippet: snippet });
        }
    }

    if (results.length === 0) {
        searchResultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    results.forEach((result, index) => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('search-result-item');
        resultItem.setAttribute('data-index', index); // Add index for keyboard navigation
        resultItem.innerHTML = `
            <h4>${result.title}</h4>
            <p>${result.snippet}</p>
        `;
        resultItem.addEventListener('click', () => {
            navigateToSection(result.id);
            const searchOverlay = document.querySelector('.search-overlay');
            searchOverlay.classList.remove('active');
            document.getElementById('search-input').value = '';
            searchResultsContainer.innerHTML = '';
            selectedResultIndex = -1; // Reset selection
        });
        searchResultsContainer.appendChild(resultItem);
    });

    // Select the first item by default if there are results
    if (results.length > 0) {
        selectedResultIndex = 0;
        searchResultsContainer.children[selectedResultIndex].classList.add('selected');
    }
}


// Simple syntax highlighting for code blocks
function highlightCode() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        let html = block.textContent;

        // Process comments first and protect them with a placeholder
        const comments = [];
        html = html.replace(/\/\/(.*)/g, (match, content) => {
            comments.push(match);
            return `___COMMENT_${comments.length - 1}___`;
        });

        // Process strings and protect them with placeholders
        const strings = [];
        html = html.replace(/"([^"]*)"/g, (match, content) => {
            strings.push(match);
            return `___STRING_${strings.length - 1}___`;
        });

        // Keywords
        const keywords = ['let', 'fn', 'if', 'else', 'return', 'struct', 'this',
                          'import', 'while', 'for', 'in', 'break', 'continue',
                          'true', 'false', 'null', 'try', 'catch', 'finally', 'async', 'await', 'future',
                          'match'];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            html = html.replace(
                regex,
                "<span class='code-keyword'>$1</span>"
            );
        });

        // Numbers
        html = html.replace(
            /\b(\d+)\b/g,
            "<span class='code-number'>$1</span>"
        );

        // Functions
        html = html.replace(
            /\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/g,
            "<span class='code-function'>$1</span>("
        );

        // Restore strings with highlighting
        strings.forEach((str, index) => {
            const highlighted = `<span class='code-string'>${str}</span>`;
            html = html.replace(`___STRING_${index}___`, highlighted);
        });

        // Restore comments with highlighting
        comments.forEach((comment, index) => {
            const highlighted = `<span class='code-comment'>${comment}</span>`;
            html = html.replace(`___COMMENT_${index}___`, highlighted);
        });

        block.innerHTML = html;
    });
}


// Mobile menu toggle (if needed)
function toggleMobileMenu(forceClose = false) {
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (!sidebar) {
        console.error('Sidebar element not found!');
        return;
    }

    console.log('toggleMobileMenu called. Current sidebar classes:', sidebar.classList.value);

    if (forceClose) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        console.log('Sidebar closed. New sidebar classes:', sidebar.classList.value);
    } else {
        const isOpen = sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        console.log('Sidebar toggled. Is now open?', isOpen, 'New sidebar classes:', sidebar.classList.value);
    }
}

// Theme management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } else {
        document.body.classList.remove('dark-theme');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (isDark) {
        localStorage.setItem('theme', 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        }
    } else {
        localStorage.setItem('theme', 'light');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTheme(); // Initialize theme on load

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }

    const mobileMenuToggleBtn = document.getElementById('mobile-menu-toggle-btn');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    
    if (mobileMenuToggleBtn) {
        console.log('Mobile menu toggle button found:', mobileMenuToggleBtn);
        mobileMenuToggleBtn.addEventListener('click', () => {
            console.log('Mobile menu toggle button clicked.');
            toggleMobileMenu();
        });
    } else {
        console.error('Mobile menu toggle button not found!');
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', () => {
            console.log('Sidebar overlay clicked (forcing close).');
            toggleMobileMenu(true);
        });
    }

    // Preload all content for search after initial navigation is done
    preloadAllContentForSearch();

    // Search overlay functionality
    const searchBtn = document.getElementById('search-btn');
    const closeSearchBtn = document.getElementById('close-search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');

    searchBtn.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        // Give browser a moment to apply 'active' class and make element visible
        setTimeout(() => {
            searchInput.focus();
        }, 50); // Small delay, adjust if necessary
    });

    closeSearchBtn.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        searchInput.value = ''; // Clear search input when closing
        searchResultsContainer.innerHTML = ''; // Clear search results
        selectedResultIndex = -1; // Reset selection on close
    });

    document.addEventListener('keydown', (e) => {
        const searchOverlay = document.querySelector('.search-overlay');
        const searchResultsContainer = document.getElementById('search-results');
        const searchInput = document.getElementById('search-input');
        
        // This line needs to be inside the active check to get current results
        let searchResultItems = []; 
        if (searchResultsContainer.children.length > 0) {
            searchResultItems = Array.from(searchResultsContainer.children);
        }

        if (searchOverlay.classList.contains('active')) {
            if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                e.preventDefault(); // Prevent page scroll for arrow keys, and form submission for Enter
            }

            if (e.key === 'ArrowDown') {
                if (searchResultItems.length === 0) return;

                // Remove 'selected' from current item if one was selected
                if (selectedResultIndex !== -1 && searchResultItems[selectedResultIndex]) {
                    searchResultItems[selectedResultIndex].classList.remove('selected');
                }

                // Move to next item or wrap around
                selectedResultIndex = (selectedResultIndex + 1) % searchResultItems.length;
                
                // Add 'selected' to new item and scroll into view
                searchResultItems[selectedResultIndex].classList.add('selected');
                searchResultItems[selectedResultIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });

            } else if (e.key === 'ArrowUp') {
                if (searchResultItems.length === 0) return;

                // Remove 'selected' from current item if one was selected
                if (selectedResultIndex !== -1 && searchResultItems[selectedResultIndex]) {
                    searchResultItems[selectedResultIndex].classList.remove('selected');
                }

                // Move to previous item or wrap around
                selectedResultIndex = (selectedResultIndex - 1 + searchResultItems.length) % searchResultItems.length;
                
                // Add 'selected' to new item and scroll into view
                searchResultItems[selectedResultIndex].classList.add('selected');
                searchResultItems[selectedResultIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else if (e.key === 'Enter') {
                if (selectedResultIndex !== -1 && searchResultItems[selectedResultIndex]) {
                    searchResultItems[selectedResultIndex].click(); // Simulate click on selected item
                }
            } else if (e.key === 'Escape') {
                searchOverlay.classList.remove('active');
                searchInput.value = '';
                searchResultsContainer.innerHTML = '';
                selectedResultIndex = -1;
            }
        }
    });

    searchInput.addEventListener('input', (e) => {
        performSearch(e.target.value);
    });
});

insert_version_to_html();