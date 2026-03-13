/**
 * ============================================
 * PREMIUM ANIMATIONS SYSTEM
 * Production-Ready JavaScript for High-End Construction Company
 * 
 * File Size: ~3KB gzipped
 * Dependencies: None (Vanilla JavaScript)
 * Browser Support: IE 11+
 * ============================================
 */

(function() {
  'use strict';

  /**
   * Feature Detection
   */
  const features = {
    intersectionObserver: 'IntersectionObserver' in window,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    supportsTransforms: 'transform' in document.documentElement.style
  };

  // ============================================
  // INTERSECTION OBSERVER - Scroll Animations
  // ============================================

  /**
   * Initialize scroll animations using Intersection Observer
   * Triggers when elements enter viewport
   */
  function initScrollAnimations() {
    if (!features.intersectionObserver) {
      // Fallback: add visible class immediately
      document.querySelectorAll(
        '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-stagger'
      ).forEach(el => el.classList.add('visible'));
      return;
    }

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(
      '.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-stagger'
    );

    animatedElements.forEach(element => {
      observer.observe(element);
    });

    return observer;
  }

  // ============================================
  // PAGE TRANSITIONS
  // ============================================

  /**
   * Handle smooth page transitions with fade in/out
   */
  function initPageTransitions() {
    const mainContent = document.querySelector('main') || document.body;
    
    // Add initial animation class
    if (mainContent && !mainContent.classList.contains('page-enter')) {
      mainContent.classList.add('page-enter');
    }

    // Listen for internal link clicks
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const isInternalLink = 
        href && 
        !href.startsWith('http') && 
        !href.startsWith('mailto:') && 
        !href.startsWith('tel:') &&
        !link.getAttribute('target');

      if (isInternalLink && !e.defaultPrevented) {
        e.preventDefault();

        // Fade out current page
        if (mainContent) {
          mainContent.classList.remove('page-enter');
          mainContent.classList.add('page-exit');
        }

        // Navigate after fade out
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      }
    });
  }

  // ============================================
  // NAVIGATION ACTIVE STATES
  // ============================================

  /**
   * Set active class on current navigation link
   */
  function initNavigationLinks() {
    const links = document.querySelectorAll('.nav-link');
    const currentPath = window.location.pathname;

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || href === window.location.pathname + '/') {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // ============================================
  // MOBILE MENU
  // ============================================

  /**
   * Mobile menu toggle and backdrop interaction
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuBackdrop = document.querySelector('.menu-backdrop');
    const menuLinks = document.querySelectorAll('.mobile-menu a');

    if (!menuToggle || !mobileMenu) return;

    const toggleMenu = (shouldOpen) => {
      const isOpen = shouldOpen ?? !mobileMenu.classList.contains('active');
      
      if (isOpen) {
        mobileMenu.classList.add('active');
        menuBackdrop?.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        mobileMenu.classList.remove('active');
        menuBackdrop?.classList.remove('active');
        document.body.style.overflow = '';
      }
    };

    // Toggle button
    menuToggle.addEventListener('click', () => toggleMenu());

    // Backdrop click (close menu)
    menuBackdrop?.addEventListener('click', () => toggleMenu(false));

    // Menu link clicks (close menu)
    menuLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    // Close menu on resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  }

  // ============================================
  // BUTTON RIPPLE EFFECT
  // ============================================

  /**
   * Add ripple effect on button click
   */
  function initButtonRipple() {
    document.addEventListener('mousedown', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      // Only for mouse events, not touch
      if (e.pointerType === 'touch') return;

      // Don't create ripple if reduced motion is preferred
      if (features.prefersReducedMotion) return;

      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);

      const ripple = document.createElement('span');
      ripple.style.position = 'absolute';
      ripple.style.left = x - size / 2 + 'px';
      ripple.style.top = y - size / 2 + 'px';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.background = 'rgba(255, 255, 255, 0.5)';
      ripple.style.borderRadius = '50%';
      ripple.style.pointerEvents = 'none';
      ripple.style.animation = 'ripple 0.6s ease-out forwards';

      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  }

  // ============================================
  // FORM ANIMATIONS
  // ============================================

  /**
   * Form input focus animations
   */
  function initFormAnimations() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea');

    inputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.style.willChange = 'border-color, box-shadow';
      });

      input.addEventListener('blur', function() {
        this.style.willChange = 'auto';
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================

  /**
   * Smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  // ============================================
  // LAZY LOAD IMAGES
  // ============================================

  /**
   * Lazy load images with fade-in animation
   */
  function initLazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    if (images.length === 0) return;

    if (!features.intersectionObserver) {
      // Fallback: load all images immediately
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    images.forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ============================================
  // PERFORMANCE MONITORING (Development Only)
  // ============================================

  /**
   * Log performance metrics
   */
  function logPerformanceMetrics() {
    if (window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1')) {
      return; // Only log on localhost
    }

    if (window.performance && window.performance.timing) {
      window.addEventListener('load', () => {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        console.log(
          '%c⚡ Page Load Time: ' + loadTime + 'ms',
          'color: #4CAF50; font-weight: bold;'
        );
      });
    }
  }

  // ============================================
  // MAIN INITIALIZATION
  // ============================================

  /**
   * Initialize all animation systems
   */
  function init() {
    // Check if DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runInitialization);
    } else {
      runInitialization();
    }
  }

  function runInitialization() {
    try {
      initScrollAnimations();
      initPageTransitions();
      initNavigationLinks();
      initMobileMenu();
      initButtonRipple();
      initFormAnimations();
      initSmoothScroll();
      initLazyLoadImages();
      logPerformanceMetrics();

      console.log('%c✓ Premium Animation System Initialized', 'color: #4CAF50; font-weight: bold;');
      
      if (features.prefersReducedMotion) {
        console.warn('⚠️ User prefers reduced motion - animations disabled');
      }
    } catch (error) {
      console.error('Animation System Error:', error);
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Expose public API for manual control
   */
  window.AnimationSystem = {
    initScrollAnimations,
    initPageTransitions,
    initNavigationLinks,
    initMobileMenu,
    initButtonRipple,
    initFormAnimations,
    initSmoothScroll,
    initLazyLoadImages,
    features,
    reinit: runInitialization
  };

  // Start initialization
  init();
})();
