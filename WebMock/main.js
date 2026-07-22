/**
 * Aetheria main.js
 * Interactive features and animations
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 2. TRABAJOS DROPDOWN MENU
  // ==========================================
  const trabajosLink = Array.from(navLinks.querySelectorAll('a')).find(link =>
    link.textContent.trim().toLowerCase() === 'trabajos' || link.id === 'nav-services'
  );

  if (trabajosLink && !trabajosLink.closest('.nav-item')) {
    const navItem = document.createElement('div');
    navItem.className = 'nav-item has-submenu';

    const submenu = document.createElement('div');
    submenu.className = 'nav-submenu';
    submenu.innerHTML = `
      <a href="areasTematicas.html">Áreas temáticas</a>
      <a href="instrucciones.html">Instrucciones</a>
      <a href="envioTrabajos.html">Envío de trabajos</a>
    `;

    const parent = trabajosLink.parentNode;
    parent.insertBefore(navItem, trabajosLink);
    navItem.appendChild(trabajosLink);
    navItem.appendChild(submenu);

    const topLevelLink = navItem.querySelector('a');
    if (topLevelLink && window.innerWidth <= 992) {
      topLevelLink.addEventListener('click', (event) => {
        if (topLevelLink.getAttribute('href') === '#trabajos-section') {
          event.preventDefault();
          navItem.classList.toggle('active');
        }
      });
    }
  }

  // ==========================================
  // 3. SCROLL HEADER STYLING
  // ==========================================
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // ==========================================
  // 2.5. LIGHT/DARK MODE TOGGLE
  // ==========================================
  const themeSwitchBtn = document.getElementById('theme-switch');
  if (themeSwitchBtn) {
    const themeIcon = themeSwitchBtn.querySelector('i');
    
    // Check initial theme preference
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Setup initial button icon
    if (currentTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun';
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }

    // Toggle click event
    themeSwitchBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      
      if (activeTheme === 'dark') {
        // Switch to Light
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
          themeIcon.className = 'fa-solid fa-moon';
        }
      } else {
        // Switch to Dark
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
          themeIcon.className = 'fa-solid fa-sun';
        }
      }
    });
  }

  // ==========================================
  // 4. GALLERY FILTERS
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length > 0 && galleryItems.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from other buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');
          
          if (filterValue === 'all' || category === filterValue) {
            // Show
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            // Hide
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ==========================================
  // 5. LIGHTBOX / MODAL OVERLAY FOR GALLERY
  // ==========================================
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxContainer = document.getElementById('lightbox-img-container');
  const lightboxCaption = document.getElementById('lightbox-caption-text');
  const lightboxClose = document.getElementById('lightbox-close-btn');

  if (lightbox && lightboxContainer && lightboxClose) {
    // Open Lightbox when clicking a gallery item
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        // Find wrapper contents (either SVG or Image)
        const wrapper = item.querySelector('.gallery-img-wrapper');
        const overlay = item.querySelector('.gallery-overlay');
        const titleText = overlay ? overlay.querySelector('.gallery-title').innerText : '';
        const categoryText = overlay ? overlay.querySelector('.gallery-category').innerText : '';
        
        // Clear previous content
        lightboxContainer.innerHTML = '';
        
        if (wrapper) {
          // If there is an SVG, clone it
          const svg = wrapper.querySelector('svg');
          if (svg) {
            const clone = svg.cloneNode(true);
            clone.setAttribute('width', '100%');
            clone.setAttribute('height', 'auto');
            lightboxContainer.appendChild(clone);
          } else {
            // If it's an image, create an image tag
            const img = wrapper.querySelector('img');
            if (img) {
              const newImg = document.createElement('img');
              newImg.src = img.src;
              newImg.alt = img.alt;
              newImg.className = 'lightbox-img';
              lightboxContainer.appendChild(newImg);
            }
          }
        }

        // Set Caption Text
        if (lightboxCaption) {
          lightboxCaption.innerHTML = `<span style="color:var(--accent); font-weight:700;">${categoryText}</span> - ${titleText}`;
        }

        // Show Lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop scrolling behind
      });
    });

    // Close Lightbox
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto'; // Enable scrolling again
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox on click outside the image container
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // 6. SCROLL REVEAL (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    // If Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Unobserve once revealed
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      // Fallback if not supported: show all immediately
      revealElements.forEach(el => el.classList.add('active'));
    }
  }

  // ==========================================
  // 7. HERO SCROLL CUE
  // ==========================================
  document.querySelectorAll('.hero-scroll-cue').forEach(cue => {
    cue.addEventListener('click', (e) => {
      e.preventDefault();
      const hero = cue.closest('.hero');
      const nextSection = hero && hero.nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});
