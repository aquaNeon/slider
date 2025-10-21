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
    // NAVIGATION ARROWS - WEBFLOW STYLING VERSION
    // ============================================
    // 
    // SETUP IN WEBFLOW:
    // 1. Add a div with class "custom_slider_arrow_prev" inside .room_slider_wrap
    // 2. Add a div with class "custom_slider_arrow_next" inside .room_slider_wrap
    // 3. Style them completely in Webflow (position, size, colors, icons, breakpoints, etc.)
    // 4. This code only adds the click functionality - all styling is yours!
    //
    // IMPORTANT CLASSES TO ADD IN WEBFLOW:
    // - Previous button: "custom_slider_arrow_prev"
    // - Next button: "custom_slider_arrow_next"
    
    // Find the arrow buttons you created in Webflow
    const prevButton = component.querySelector('.custom_slider_arrow_prev');
    const nextButton = component.querySelector('.custom_slider_arrow_next');
    
    // Check if buttons exist
    if (!prevButton || !nextButton) {
      console.warn('Arrow buttons not found! Make sure you have divs with classes "custom_slider_arrow_prev" and "custom_slider_arrow_next" in your Webflow project.');
    }
    
    // Add required Swiper classes (for functionality only, no styling)
    if (prevButton && !prevButton.classList.contains('swiper-button-prev')) {
      prevButton.classList.add('swiper-button-prev');
    }
    if (nextButton && !nextButton.classList.contains('swiper-button-next')) {
      nextButton.classList.add('swiper-button-next');
    }
    
    // Remove ALL Swiper's default styling so you have complete control
    const removeAllSwiperStyling = () => {
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
            position: static !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
            margin: 0 !important;
            width: auto !important;
            height: auto !important;
            transform: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    };
    removeAllSwiperStyling();
    
    // ARROWS CODE BLOCK END HERE 

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
      
      // NAVIGATION: Connect your Webflow-styled arrow buttons to Swiper
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
