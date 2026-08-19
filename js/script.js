/* =========================================
   CONSOLE EASTER EGG
   Only visible to people who open DevTools
   Console — not in View Source or Inspect
   Element, unlike an HTML comment.
   ========================================= */
console.log(
`
__        ___           _   _                  ___
\\ \\      / / |__   __ _| |_( )___   _   _ _ __|__ \\
 \\ \\ /\\ / /| '_ \\ / _\` | __|// __| | | | | '_ \\ / /
  \\ V  V / | | | | (_| | |_  \\__ \\ | |_| | |_) |_|
   \\_/\\_/  |_| |_|\\__,_|\\__| |___/  \\__,_| .__/(_)
                                         |_|

        Checking my code? Don't be shy, I don't bite and I'd love to chat,
        whether it's about code, design, manga, mobile games,
        manhwa, or anything in between.

        - JWebcell (Justin Marc)
`
);

/* =========================================
   LOAD PAGE CONTENT FROM SEPARATE FILES
   Keeps About/Experience/Projects text in
   their own HTML files under content/ so
   they're easy to edit without touching
   index.html.
   NOTE: only works when served over http(s) —
   e.g. GitHub Pages or a local dev server.
   Opening index.html directly (file://) will
   not load this due to browser security rules.
   ========================================= */
function loadContent(targetId, filePath) {
    const target = document.getElementById(targetId);
    if (!target) return;

    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            return response.text();
        })
        .then(html => {
            target.innerHTML = html;
        })
        .catch(error => {
            console.error(error);
            // Fallback so the section isn't left blank if the fetch fails
            target.innerHTML = '<p>Content could not be loaded.</p>';
        });
}

function loadAllContent() {
    loadContent('about-content', 'content/about.html');
    loadContent('experience-content', 'content/experience.html');
    loadContent('projects-content', 'content/projects.html');
}

/* =========================================
   STICKY NAVIGATION
   Handles the scroll-spy underline slider and
   the nav bar switching to fixed position.
   ========================================= */
class StickyNavigation {
    constructor() {
        this.currentId = null;
        this.currentTab = null;
        this.tabContainerHeight = 70;
        let self = this;
        $('.et-hero-tab').click(function(event) {
            self.onTabClick(event, $(this));
        });
        $(window).scroll(() => { this.onScroll(); });
        $(window).resize(() => { this.onResize(); });
    }

    onTabClick(event, element) {
        event.preventDefault();
        let target = $(element.attr('href'));
        if (target.length) {
            let scrollTop = target.offset().top - this.tabContainerHeight + 1;
            $('html, body').animate({ scrollTop: scrollTop }, 600);
        }
    }

    onScroll() {
        this.checkTabContainerPosition();
        this.findCurrentTabSelector();
    }

    onResize() {
        if (this.currentId) {
            this.setSliderCss();
        }
    }

    checkTabContainerPosition() {
        let offset = $('.et-hero-tabs').offset().top + $('.et-hero-tabs').height() - this.tabContainerHeight;
        if ($(window).scrollTop() > offset) {
            $('.et-hero-tabs-container').addClass('et-hero-tabs-container--top');
        } else {
            $('.et-hero-tabs-container').removeClass('et-hero-tabs-container--top');
        }
    }

    findCurrentTabSelector() {
        let newCurrentId = null;
        let newCurrentTab = null;
        let self = this;

        $('.et-hero-tab').each(function() {
            let id = $(this).attr('href');
            let target = $(id);
            if (target.length) {
                let offsetTop = target.offset().top - self.tabContainerHeight - 50;
                let offsetBottom = target.offset().top + target.height() - self.tabContainerHeight;
                if ($(window).scrollTop() > offsetTop && $(window).scrollTop() < offsetBottom) {
                    newCurrentId = id;
                    newCurrentTab = $(this);
                }
            }
        });

        if (this.currentId !== newCurrentId || this.currentId === null) {
            this.currentId = newCurrentId;
            this.currentTab = newCurrentTab;
            this.setSliderCss();
        }
    }

    setSliderCss() {
        let width = 0;
        let left = 0;
        if (this.currentTab && this.currentTab.length && window.innerWidth >= 800) {
            width = this.currentTab.css('width');
            left = this.currentTab.offset().left - $('.et-hero-tabs-container').offset().left;
        }
        $('.et-hero-tab-slider').css('width', width);
        $('.et-hero-tab-slider').css('left', left);
    }
}

/* =========================================
   DARK MODE TOGGLE
   Remembers the user's choice in localStorage.
   ========================================= */
function initThemeToggle() {
    const toggleBtn = document.getElementById('darkModeToggle');
    const body = document.body;
    const icon = toggleBtn.querySelector('i');

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    }

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            icon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

/* =========================================
   MOBILE HAMBURGER MENU
   ========================================= */
function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.querySelector('.nav-links');
    const tabs = document.querySelectorAll('.et-hero-tab');
    const icon = hamburgerBtn.querySelector('i');

    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        if (navLinks.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navLinks.classList.remove('active');
            icon.classList.replace('fa-xmark', 'fa-bars');
        });
    });
}

/* =========================================
   SCROLL REVEAL LOGIC
   Fades/slides elements in as they enter view.
   ========================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");

    function reveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach((element) => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", reveal);
    reveal();
}

/* =========================================
   INITIALIZE EVERYTHING ONCE DOM IS READY
   ========================================= */
$(document).ready(function() {
    loadAllContent();
    new StickyNavigation();
    initThemeToggle();
    initMobileMenu();
    initScrollReveal();
});
