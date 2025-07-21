// Function to initialize lazy loading for embeds
export function initLazyEmbeds() {
  // Select all lazy embed containers
  const lazyEmbedContainers = document.querySelectorAll('.lazy-embed-container');

  // If IntersectionObserver is supported
  if ('IntersectionObserver' in window) {
    // Create a new IntersectionObserver
    const embedObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // If the element is in view
        if (entry.isIntersecting) {
          const container = entry.target;
          const shouldEmbed = container.dataset.shouldEmbed === 'true';

          // Only load embed if it should be embedded
          if (shouldEmbed) {
            // Get embed information from data attributes
            const embedUrl = container.dataset.embedUrl;
            const clipTitle = container.dataset.clipTitle;

            // Create iframe element
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            iframe.scrolling = 'no';
            iframe.allow = 'autoplay; fullscreen';
            iframe.className = 'w-full h-full absolute top-0 left-0';
            iframe.title = clipTitle;

            // Remove the placeholder
            const placeholder = container.querySelector('.lazy-embed-placeholder');
            if (placeholder) {
              placeholder.remove();
            }

            // Hide the thumbnail
            const thumbnail = container.querySelector('.lazy-embed-thumbnail');
            if (thumbnail) {
              thumbnail.style.display = 'none';
            }

            // Add the iframe to the container
            container.appendChild(iframe);

            // Stop observing this element
            observer.unobserve(container);
          }
        }
      });
    }, {
      // Options for the observer
      rootMargin: '100px', // Load embeds when they're 100px from entering the viewport
      threshold: 0.1 // Trigger when at least 10% of the element is visible
    });

    // Start observing each container
    lazyEmbedContainers.forEach(container => {
      embedObserver.observe(container);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    // Just load all embeds immediately
    lazyEmbedContainers.forEach(container => {
      const shouldEmbed = container.dataset.shouldEmbed === 'true';
      if (shouldEmbed) {
        const embedUrl = container.dataset.embedUrl;
        const clipTitle = container.dataset.clipTitle;

        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.scrolling = 'no';
        iframe.allow = 'autoplay; fullscreen';
        iframe.className = 'w-full h-full absolute top-0 left-0';
        iframe.title = clipTitle;

        const placeholder = container.querySelector('.lazy-embed-placeholder');
        if (placeholder) {
          placeholder.remove();
        }

        const thumbnail = container.querySelector('.lazy-embed-thumbnail');
        if (thumbnail) {
          thumbnail.style.display = 'none';
        }

        container.appendChild(iframe);
      }
    });
  }
}
