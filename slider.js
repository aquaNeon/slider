<script>
window.initHangerDrop = function() {
  const isTabletOrMobile = window.innerWidth <= 768;
  
  if (isTabletOrMobile) {
    document.querySelectorAll('.room_slider_contain').forEach(container => {
      const textBox = container.querySelector('.room_slider_text_wrap');
      if (textBox) {
        textBox.classList.add('hanger-dropped');
        textBox.classList.add('no-animation');
        textBox.style.transition = 'none';
        textBox.style.animation = 'none';
      }
    });
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const textBox = entry.target.querySelector('.room_slider_text_wrap');
        if (textBox && !textBox.classList.contains('hanger-dropped')) {
          textBox.classList.add('hanger-dropped');
          textBox.classList.add('drop-animation');
        }
      }
    });
  }, {
    threshold: 0.3, 
    rootMargin: '0px 0px -200px 0px' 
  });
  
  document.querySelectorAll('.room_slider_contain').forEach(container => {
    observer.observe(container);
  });
};

window.initComponentSliders = function() {
  const sliderWraps = document.querySelectorAll(".room_slider_wrap");
  
  sliderWraps.forEach((component, index) => {
    if (component.dataset.swiperInit) {
      return;
    }
    
    const cmsWrap = component.querySelector(".room_slider_swiper");
    const textBox = component.querySelector(".room_slider_text_wrap");
    
    if (!cmsWrap || !textBox) {
      return;
    }
    
    // Creates the pagination dots at the bottom of the slider
    const paginationEl = document.createElement('div');
    paginationEl.className = 'swiper-pagination room-slider-pagination';
    paginationEl.style.cssText = `
      position: absolute !important;
      bottom: 2rem !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      z-index: 200 !important;
      display: block !important;
      text-align: center !important;
      width: auto !important;
      margin-top: 60px !important;
    `;
    component.appendChild(paginationEl);
    
    // ============================================
    // ARROWS NEW CODE 
    // ============================================
    // 
    // HOW TO USE IN WEBFLOW:
    // Option 1: Create arrows in Webflow
    //   1. Add a div with class "custom_slider_arrow_prev" inside .room_slider_wrap
    //   2. Add a div with class "custom_slider_arrow_next" inside .room_slider_wrap
    //   3. Style them in Webflow
    //   4. The code will automatically connect them to Swiper navigation
    //
    // Option 2: Use JavaScript-generated arrows (fallback, what you see now)
    //   - If no Webflow arrows exist, this code creates basic white circular buttons
    //   - You can style these with CSS or remove the inline styles below
    //
    // STYLING OPTIONS:
    //   - Remove all the inline styles below and style with custom CSS
    //   - OR modify the inline styles directly in this code
    //   - OR create arrows in Webflow and this code will use those instead
    
    // TRY TO FIND EXISTING ARROW DIVS FROM WEBFLOW
    let prevButton = component.querySelector('.custom_slider_arrow_prev');
    let nextButton = component.querySelector('.custom_slider_arrow_next');
    
    // IF ARROWS DON'T EXIST IN WEBFLOW, CREATE THEM WITH JAVASCRIPT (FALLBACK)
    if (!prevButton) {
      prevButton = document.createElement('div');
      prevButton.className = 'swiper-button-prev custom_slider_arrow_prev';
      prevButton.innerHTML = '←'; 
      
      // FALLBACK STYLING - ONLY USED IF ARROWS NOT CREATED IN WEBFLOW
      // You can delete all this inline styling and use external CSS instead
      // OR modify these values to customize the look
      prevButton.style.cssText = `
        position: absolute !important;
        left: 20px !important;                    /* Distance from left edge */
        z-index: 200 !important;                  /* Keep above slider content */
        width: 50px !important;                   /* Button width */
        height: 50px !important;                  /* Button height */
        background: rgba(255, 255, 255, 0.9) !important; /* White background with slight transparency */
        border-radius: 50% !important;            /* Makes it circular (use 8px for rounded square) */
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        font-size: 24px !important;               /* Size of arrow/icon inside */
        color: #333 !important;                   /* Arrow/icon color */
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important; /* Subtle shadow */
        user-select: none !important;
      `;
      
      component.appendChild(prevButton);
    }
    
    if (!nextButton) {
      nextButton = document.createElement('div');
      nextButton.className = 'swiper-button-next custom_slider_arrow_next';
      nextButton.innerHTML = '→'; // add your icon/arrow here or in Webflow
      
      // FALLBACK STYLING - ONLY USED IF ARROWS NOT CREATED IN WEBFLOW
      // You can delete all this inline styling and use external CSS instead
      // OR modify these values to customize the look
      nextButton.style.cssText = `
        position: absolute !important;
        right: 20px !important;                   /* Distance from right edge */
        z-index: 200 !important;
        width: 50px !important;
        height: 50px !important;
        background: rgba(255, 255, 255, 0.9) !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        cursor: pointer !important;
        font-size: 24px !important;
        color: #333 !important;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
        user-select: none !important;
      `;
      
      component.appendChild(nextButton);
    }
    
    // ENSURE SWIPER CLASSES ARE ADDED 
    if (!prevButton.classList.contains('swiper-button-prev')) {
      prevButton.classList.add('swiper-button-prev');
    }
    if (!nextButton.classList.contains('swiper-button-next')) {
      nextButton.classList.add('swiper-button-next');
    }
    
    // HIDE SWIPER'S DEFAULT ARROW PSEUDO-ELEMENTS
    const hideDefaultArrows = () => {
      const styleId = 'swiper-arrow-override-' + index;
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
          .room_slider_wrap .swiper-button-prev::after,
          .room_slider_wrap .swiper-button-next::after {
            content: none !important;
            display: none !important;
          }
          .room_slider_wrap .swiper-button-prev,
          .room_slider_wrap .swiper-button-next {
            margin-top: 0 !important;
            transition: none !important;
          }
          .room_slider_wrap .swiper-button-prev.swiper-button-disabled,
          .room_slider_wrap .swiper-button-next.swiper-button-disabled {
            opacity: 1 !important;
            transition: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    };
    hideDefaultArrows();
    
    // LOCK ARROWS AT ONE FIXED POSITION
    // Calculates position based on first slide, then locks it permanently
    const lockArrowsAtFixedPosition = () => {
      setTimeout(() => {
        // Get the swiper container's dimensions
        const swiperRect = cmsWrap.getBoundingClientRect();
        const componentRect = component.getBoundingClientRect();
        
        // Calculate the vertical center position
        const centerY = (swiperRect.top - componentRect.top) + (swiperRect.height / 2);
        
        // Function to force arrows to stay at this exact position
        const lockPosition = () => {
          if (prevButton) {
            prevButton.style.setProperty('top', centerY + 'px', 'important');
            prevButton.style.setProperty('transform', 'translateY(-50%)', 'important');
            prevButton.style.setProperty('margin-top', '0', 'important');
          }
          if (nextButton) {
            nextButton.style.setProperty('top', centerY + 'px', 'important');
            nextButton.style.setProperty('transform', 'translateY(-50%)', 'important');
            nextButton.style.setProperty('margin-top', '0', 'important');
          }
        };
        
        // Lock immediately
        lockPosition();
        
        // Keep forcing this position every 100ms to override any Swiper changes
        // This prevents buttons from recalculation position if text height changes in one slide
        setInterval(lockPosition, 100);
      }, 200);
    };
    
    // ARROWS NEW CODE BLOCK END HERE 

    // Updates the text content when slides change
    const updateTextContent = (activeIndex) => {
      const slides = cmsWrap.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
      const actualIndex = activeIndex % slides.length;
      const activeSlide = slides[actualIndex];
      
      if (!activeSlide) return;
      
      const titleElement = activeSlide.querySelector('.room_slider_hidden_text.is-title');
      const descriptionElement = activeSlide.querySelector('.room_slider_hidden_text.is-info');
      
      const newTitle = titleElement?.textContent?.trim() || 'Room Title';
      const newDescription = descriptionElement?.textContent?.trim() || 'Room description';
      
      const titleTarget = textBox.querySelector('.room_slider_text_heading');
      const descriptionTarget = textBox.querySelector('.room_slider_text');
      
      textBox.style.transition = 'opacity 0.3s ease';
      textBox.style.opacity = '0.7';
      
      setTimeout(() => {
        if (titleTarget) titleTarget.textContent = newTitle;
        if (descriptionTarget) descriptionTarget.textContent = newDescription;
        textBox.style.opacity = '1';
      }, 150);
    };
    

    // Copies Webflow hover interactions to duplicate slides created by loop mode
    const copyWebflowInteractionsToDuplicates = () => {
      const originalSlides = cmsWrap.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');
      const duplicateSlides = cmsWrap.querySelectorAll('.swiper-slide.swiper-slide-duplicate');
      
      duplicateSlides.forEach(duplicate => {
        const duplicateContent = duplicate.innerHTML;
        
        const originalSlide = Array.from(originalSlides).find(original => 
          original.innerHTML === duplicateContent
        );
        
        if (originalSlide) {
          const originalImg = originalSlide.querySelector('.room_slider_img');
          const duplicateImg = duplicate.querySelector('.room_slider_img');
          
          if (originalImg && duplicateImg) {
            Array.from(originalImg.attributes).forEach(attr => {
              duplicateImg.setAttribute(attr.name, attr.value);
            });
            
            duplicateImg.className = originalImg.className;
            
            ['mouseenter', 'mouseleave', 'click', 'mouseover', 'mouseout', 'focus', 'blur'].forEach(eventType => {
              duplicateImg.addEventListener(eventType, function(e) {
                const newEvent = new MouseEvent(eventType, {
                  bubbles: e.bubbles,
                  cancelable: e.cancelable,
                  view: e.view,
                  detail: e.detail,
                  screenX: e.screenX,
                  screenY: e.screenY,
                  clientX: e.clientX,
                  clientY: e.clientY,
                  ctrlKey: e.ctrlKey,
                  altKey: e.altKey,
                  shiftKey: e.shiftKey,
                  metaKey: e.metaKey,
                  button: e.button,
                  buttons: e.buttons,
                  relatedTarget: e.relatedTarget
                });
                
                originalImg.dispatchEvent(newEvent);
                
                if (eventType === 'mouseenter' && originalImg.onmouseenter) {
                  originalImg.onmouseenter.call(originalImg, newEvent);
                }
                if (eventType === 'mouseleave' && originalImg.onmouseleave) {
                  originalImg.onmouseleave.call(originalImg, newEvent);
                }
                if (eventType === 'click' && originalImg.onclick) {
                  originalImg.onclick.call(originalImg, newEvent);
                }
              });
            });
            
            if (window.Webflow) {
              duplicateImg.setAttribute('data-w-interaction-cloned', 'true');
              
              setTimeout(() => {
                if (window.Webflow.require) {
                  try {
                    const ix2 = window.Webflow.require('ix2');
                    if (ix2 && ix2.store) {
                      const elementState = ix2.store.getState();
                      if (elementState) {
                        ix2.actions.elementStateChanged(duplicateImg, {});
                      }
                    }
                  } catch (e) {
                    console.log('Advanced Webflow integration attempt:', e);
                  }
                }
              }, 100);
            }
          }
        }
      });
    };
    

    // Initialize the Swiper slider with all settings
    const swiper = new Swiper(cmsWrap, {
      slidesPerView: 1.5,  
      spaceBetween: 200,
      centeredSlides: true,
      loop: true,
      slideToClickedSlide: true,
      speed: 400,
      grabCursor: true,
      touchRatio: 1,
      simulateTouch: true,
      allowTouchMove: true,
      
      // NAVIGATION: Connect the arrow buttons to Swiper
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton,
      },
      
      // PAGINATION: Connect the dots to Swiper
      pagination: {
        el: paginationEl,
        clickable: true,
        type: 'bullets',
        renderBullet: function (index, className) {
          return '<span class="' + className + '"></span>';
        },
      },
      
      // RESPONSIVE BREAKPOINTS: Adjust slider for different screen sizes
      breakpoints: {
        250: {
          slidesPerView: 1.15,
          spaceBetween: 120,
          centeredSlides: true
        },
        500: {
          slidesPerView: 1.25,
          spaceBetween: 120,
          centeredSlides: true
        },
        768: {
          slidesPerView: 1.25,
          spaceBetween: 100,
          centeredSlides: true
        },
        1024: {
          slidesPerView: 1.5,
          spaceBetween: 120,
          centeredSlides: true
        }
      },
      
      // EVENT HANDLERS
      on: {
        init: function() {
          updateTextContent(this.realIndex);
          
          // Lock arrow positions after slider initializes
          lockArrowsAtFixedPosition();
          
          setTimeout(() => {
            copyWebflowInteractionsToDuplicates();
            
            if (window.Webflow) {
              try {
                window.Webflow.destroy();
                window.Webflow.ready();
                
                if (window.Webflow.require) {
                  const ix2 = window.Webflow.require('ix2');
                  if (ix2) {
                    ix2.init();
                    if (ix2.store) {
                      ix2.store.dispatch({ type: 'IX2_ELEMENT_STATE_CHANGED' });
                    }
                  }
                }
              } catch (e) {
                console.log('Webflow reinit error:', e);
                if (window.Webflow.ready) {
                  window.Webflow.ready();
                }
              }
            }
            
            const allImages = cmsWrap.querySelectorAll('.room_slider_img');
            allImages.forEach(img => {
              img.style.display = 'none';
              img.offsetHeight;
              img.style.display = '';
              img.classList.add('interaction-ready');
            });
          }, 300);
        },
        
        slideChange: function() {
          updateTextContent(this.realIndex);
        }
      }
    });
    
    component.dataset.swiperInit = "true";
  });
};


document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    window.initHangerDrop();
    window.initComponentSliders();
  }, 100);
});
</script>
