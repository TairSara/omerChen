// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Header shadow on scroll
const header = document.querySelector('.header');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.08)';
        } else {
            header.style.boxShadow = 'none';
        }
    });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formMessage = document.getElementById('formMessage');
        const originalBtnText = submitBtn.textContent;

        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'שולח...';
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                formMessage.textContent = 'ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.';
                formMessage.classList.add('success');
                this.reset();
            } else {
                formMessage.textContent = result.message || 'שגיאה בשליחת ההודעה. נסה שוב.';
                formMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Error:', error);
            formMessage.textContent = 'שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.';
            formMessage.classList.add('error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Animation on scroll (simple fade in)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply animation to sections (except hero and page-header)
document.querySelectorAll('section:not(.hero):not(.page-header)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Workshop Modal Functionality
const workshopCards = document.querySelectorAll('.workshop-card-new');
const workshopModals = document.querySelectorAll('.workshop-modal');
const modalCloseButtons = document.querySelectorAll('.workshop-modal-close');

// Open modal when clicking workshop card
workshopCards.forEach(card => {
    card.addEventListener('click', () => {
        const workshopId = card.getAttribute('data-workshop');
        const modal = document.getElementById(`workshop-${workshopId}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close modal when clicking close button
modalCloseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = btn.closest('.workshop-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal when clicking outside content
workshopModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        workshopModals.forEach(modal => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// Workshop modal thumbnail gallery - Workshop 1 (images only)
document.querySelectorAll('#workshop-1 .workshop-modal-thumbs img').forEach(thumb => {
    thumb.addEventListener('click', (e) => {
        const gallery = thumb.closest('.workshop-modal-gallery');
        const mainImage = gallery.querySelector('.main-image');
        if (mainImage) {
            mainImage.src = thumb.src;
        }
    });
});

// Workshop 2 - Toggle between video and images
document.querySelectorAll('#gallery-workshop-2 .thumb-item').forEach(thumb => {
    thumb.addEventListener('click', () => {
        const gallery = document.getElementById('gallery-workshop-2');
        const mainVideo = gallery.querySelector('.main-video');
        const mainImage = gallery.querySelector('.main-image');
        const thumbs = gallery.querySelectorAll('.thumb-item');

        // Remove active from all thumbs
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');

        const type = thumb.getAttribute('data-type');
        const src = thumb.getAttribute('data-src');

        if (type === 'video') {
            mainVideo.style.display = 'block';
            mainImage.style.display = 'none';
            mainVideo.play();
        } else {
            mainVideo.style.display = 'none';
            mainVideo.pause();
            mainImage.style.display = 'block';
            mainImage.src = src;
        }
    });
});

// Recipe Card Video Hover
document.querySelectorAll('.recipe-card-video video').forEach(video => {
    const card = video.closest('.recipe-card-new');
    card.addEventListener('mouseenter', () => {
        video.play();
    });
    card.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
    });
});

// Recipe Modal Functionality
const recipeCards = document.querySelectorAll('.recipe-card-new');
const recipeModals = document.querySelectorAll('.recipe-modal');
const recipeCloseButtons = document.querySelectorAll('.recipe-modal-close');

// Open recipe modal
recipeCards.forEach(card => {
    card.addEventListener('click', () => {
        const recipeId = card.getAttribute('data-recipe');
        const modal = document.getElementById(`recipe-${recipeId}`);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close recipe modal
recipeCloseButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const modal = btn.closest('.recipe-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close recipe modal when clicking outside
recipeModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close recipe modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        recipeModals.forEach(modal => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// ============================================
// FAQ ACCORDION FUNCTIONALITY
// ============================================
const faqQuestions = document.querySelectorAll('.faq-question');

faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.closest('.faq-accordion-item');
        const isActive = item.classList.contains('active');

        // Close all other items
        document.querySelectorAll('.faq-accordion-item').forEach(otherItem => {
            otherItem.classList.remove('active');
        });

        // Toggle current item
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ============================================
// GALLERY LIGHTBOX FUNCTIONALITY
// ============================================
const lightbox = document.getElementById('galleryLightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxVideo = document.querySelector('.lightbox-video');
const lightboxVideoSource = lightboxVideo ? lightboxVideo.querySelector('source') : null;
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxCounter = document.querySelector('.lightbox-counter');

// Current gallery state
let currentImages = [];
let currentImageIndex = 0;
let currentTitle = '';
let isVideoMode = false;

// Open product gallery (multiple images)
function openProductGallery(images, title) {
    if (!lightbox) return;

    currentImages = images;
    currentImageIndex = 0;
    currentTitle = title;
    isVideoMode = false;

    updateProductLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Open single video
function openVideoLightbox(src) {
    if (!lightbox) return;

    isVideoMode = true;
    currentImages = [];

    if (lightboxVideoSource) {
        lightboxVideoSource.src = src;
        lightboxVideo.load();
    }
    lightboxVideo.classList.add('active');
    lightboxImage.classList.remove('active');

    // Hide title and counter for videos
    if (lightboxTitle) lightboxTitle.style.display = 'none';
    if (lightboxCounter) lightboxCounter.style.display = 'none';

    // Hide navigation for single video
    if (lightboxPrev) lightboxPrev.style.display = 'none';
    if (lightboxNext) lightboxNext.style.display = 'none';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Update product lightbox content
function updateProductLightbox() {
    if (currentImages.length === 0) return;

    const src = currentImages[currentImageIndex];
    lightboxImage.src = src;
    lightboxImage.classList.add('active');
    lightboxVideo.classList.remove('active');

    if (lightboxVideo) {
        lightboxVideo.pause();
    }

    // Update title
    if (lightboxTitle) {
        lightboxTitle.textContent = currentTitle;
        lightboxTitle.style.display = 'block';
    }

    // Update counter
    if (lightboxCounter) {
        if (currentImages.length > 1) {
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentImages.length}`;
            lightboxCounter.style.display = 'block';
        } else {
            lightboxCounter.style.display = 'none';
        }
    }

    // Show/hide navigation based on image count
    if (currentImages.length > 1) {
        if (lightboxPrev) lightboxPrev.style.display = 'flex';
        if (lightboxNext) lightboxNext.style.display = 'flex';
    } else {
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
    }
}

// Close lightbox
function closeLightbox() {
    if (!lightbox) return;

    lightbox.classList.remove('active');
    document.body.style.overflow = '';

    // Stop video if playing
    if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.currentTime = 0;
    }

    // Reset state
    currentImages = [];
    currentImageIndex = 0;
    isVideoMode = false;
}

// Navigate to previous image
function prevImage() {
    if (isVideoMode || currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    updateProductLightbox();
}

// Navigate to next image
function nextImage() {
    if (isVideoMode || currentImages.length <= 1) return;
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    updateProductLightbox();
}

// Initialize gallery if on gallery page
if (lightbox) {
    // Click on product cards
    document.querySelectorAll('.product-card').forEach(item => {
        item.addEventListener('click', () => {
            const imagesData = item.getAttribute('data-images');
            const title = item.getAttribute('data-title') || '';

            if (imagesData) {
                try {
                    const images = JSON.parse(imagesData);
                    openProductGallery(images, title);
                } catch (e) {
                    console.error('Error parsing images:', e);
                }
            }
        });
    });

    // Click on video items
    document.querySelectorAll('.video-item').forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-src');
            if (src) {
                openVideoLightbox(src);
            }
        });
    });

    // Close button
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Navigation buttons
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }

    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }

    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            prevImage(); // RTL
        } else if (e.key === 'ArrowLeft') {
            nextImage(); // RTL
        }
    });

    // Video hover autoplay in gallery
    document.querySelectorAll('.video-item video').forEach(video => {
        const item = video.closest('.video-item');
        item.addEventListener('mouseenter', () => {
            video.play();
        });
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
}

// ============================================
// WORKSHOP PHOTOS AUTO-SCROLL
// ============================================
const workshopPhotosScroll = document.querySelector('.workshop-photos-scroll');
const workshopPhotosTrack = document.querySelector('.workshop-photos-track');

if (workshopPhotosScroll && workshopPhotosTrack) {
    let scrollSpeed = 1;
    let isHovered = false;
    let scrollDirection = 1; // 1 = left (for RTL), -1 = right

    function autoScroll() {
        if (!isHovered) {
            workshopPhotosScroll.scrollLeft += scrollSpeed * scrollDirection;

            // Reverse direction at edges
            const maxScroll = workshopPhotosScroll.scrollWidth - workshopPhotosScroll.clientWidth;
            if (workshopPhotosScroll.scrollLeft >= maxScroll) {
                scrollDirection = -1;
            } else if (workshopPhotosScroll.scrollLeft <= 0) {
                scrollDirection = 1;
            }
        }
        requestAnimationFrame(autoScroll);
    }

    // Pause on hover
    workshopPhotosScroll.addEventListener('mouseenter', () => {
        isHovered = true;
    });

    workshopPhotosScroll.addEventListener('mouseleave', () => {
        isHovered = false;
    });

    // Pause on touch
    workshopPhotosScroll.addEventListener('touchstart', () => {
        isHovered = true;
    });

    workshopPhotosScroll.addEventListener('touchend', () => {
        setTimeout(() => {
            isHovered = false;
        }, 2000); // Resume after 2 seconds
    });

    // Start auto-scroll
    autoScroll();
}

// ============================================
// HERO IMAGE TOGGLE ON MOBILE
// ============================================
document.querySelectorAll('.hero-image-hover').forEach(container => {
    let touchHandled = false;

    // Use touchend for iOS/mobile support
    container.addEventListener('touchend', (e) => {
        e.preventDefault();
        touchHandled = true;
        container.classList.toggle('active');
        // Reset after a short delay
        setTimeout(() => { touchHandled = false; }, 300);
    });

    // Click for desktop (only if not handled by touch)
    container.addEventListener('click', () => {
        if (!touchHandled) {
            container.classList.toggle('active');
        }
    });
});

// ============================================
// GALLERY VIDEO PREVIEW ON TAP (MOBILE)
// ============================================
// Initialize videos on first user interaction (for iOS)
let videosInitialized = false;
function initializeVideos() {
    if (videosInitialized) return;
    videosInitialized = true;
    document.querySelectorAll('.video-item video').forEach(video => {
        video.load();
        video.currentTime = 0.001;
    });
}

// Try to initialize on first touch anywhere
document.addEventListener('touchstart', initializeVideos, { once: true });

document.querySelectorAll('.video-item').forEach(item => {
    const video = item.querySelector('video');
    if (video) {
        // Try to load on desktop
        video.load();

        // Handle tap/click to play video
        const playVideo = (e) => {
            e.preventDefault();
            // Stop all other videos first
            document.querySelectorAll('.video-item video').forEach(v => {
                if (v !== video) {
                    v.pause();
                    v.currentTime = 0;
                }
            });

            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        };

        item.addEventListener('touchend', playVideo);
        item.addEventListener('click', playVideo);
    }
});
