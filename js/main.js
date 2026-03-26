document.addEventListener('DOMContentLoaded', () => {
  // Scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .card-reveal').forEach(el => {
    observer.observe(el);
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href*="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      // Check if the link points to the current page
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      
      const targetUrl = new URL(this.href);
      if (targetUrl.pathname === window.location.pathname) {
        const targetId = targetUrl.hash;
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Get header height for offset
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          
          const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Update URL without jumping
          history.pushState(null, null, targetId);
        }
      }
    });
  });

  // Header scroll effect
  const header = document.querySelector('header');
  if (header && !header.classList.contains('header-solid')) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // Tour Filtering Logic
  const filterDifficulty = document.getElementById('filter-difficulty');
  const filterDuration = document.getElementById('filter-duration');
  const filterType = document.getElementById('filter-type');
  const tourSearch = document.getElementById('tour-search');
  const tourCards = document.querySelectorAll('.tour-card');
  const noResultsMessage = document.getElementById('no-results-message');
  const resetFiltersBtn = document.getElementById('reset-filters');

  function filterTours() {
    if (!filterDifficulty || !filterDuration || !filterType) return;

    const difficultyVal = filterDifficulty.value;
    const durationVal = filterDuration.value;
    const typeVal = filterType.value;
    const searchVal = tourSearch ? tourSearch.value.toLowerCase().trim() : '';

    let visibleCount = 0;

    tourCards.forEach(card => {
      const cardDifficulty = card.getAttribute('data-difficulty');
      const cardDuration = card.getAttribute('data-duration');
      const cardType = card.getAttribute('data-type');
      const cardText = card.textContent.toLowerCase();

      const matchDifficulty = difficultyVal === 'all' || cardDifficulty === difficultyVal;
      const matchDuration = durationVal === 'all' || cardDuration === durationVal || (durationVal === '3' && parseInt(cardDuration) >= 3);
      const matchType = typeVal === 'all' || cardType.includes(typeVal);
      const matchSearch = searchVal === '' || cardText.includes(searchVal);

      if (matchDifficulty && matchDuration && matchType && matchSearch) {
        card.style.display = 'flex';
        // Reset animation for visible cards
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.classList.remove('visible');
      }
    });

    if (visibleCount === 0) {
      noResultsMessage.style.display = 'block';
    } else {
      noResultsMessage.style.display = 'none';
    }
  }

  if (filterDifficulty) filterDifficulty.addEventListener('change', filterTours);
  if (filterDuration) filterDuration.addEventListener('change', filterTours);
  if (filterType) filterType.addEventListener('change', filterTours);
  if (tourSearch) tourSearch.addEventListener('input', filterTours);

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      filterDifficulty.value = 'all';
      filterDuration.value = 'all';
      filterType.value = 'all';
      if (tourSearch) tourSearch.value = '';
      filterTours();
    });
  }

  // Share functionality for blog posts
  const shareBtn = document.querySelector('.share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: document.title,
        text: 'Scopri questo articolo su Moto Travel Trentino',
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error('Errore durante la condivisione:', err);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          const originalHTML = shareBtn.innerHTML;
          // Show checkmark icon
          shareBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
          setTimeout(() => {
            shareBtn.innerHTML = originalHTML;
          }, 2000);
        } catch (err) {
          console.error('Errore nella copia del link:', err);
        }
      }
    });
  }

  // Moduli Formativi Sidebar Active State
  const moduleSections = document.querySelectorAll('.module-section');
  const sidebarLinks = document.querySelectorAll('.modules-sidebar a');

  if (moduleSections.length > 0 && sidebarLinks.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-250px 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);

    moduleSections.forEach(section => {
      observer.observe(section);
    });
  }

  // Scroll to Top Button
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.setAttribute('aria-label', 'Torna all\'inizio');
  scrollToTopBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });

  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
