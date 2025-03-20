document.addEventListener('DOMContentLoaded', () => {
    // FAQ Functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            item.classList.toggle('active');
        });
    });

    // API Configuration
    const API_BASE_URL = 'http://localhost:5000/api';

    // Feature Upload Functionality
    const featureUploadBtns = document.querySelectorAll('.feature-upload-btn');
    
    featureUploadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                const file = e.target.files[0];
                handleFeatureFile(file, btn);
            };
            input.click();
        });
    });

    function handleFeatureFile(file, uploadBtn) {
        if (file && file.type.startsWith('image/')) {
            const featureCard = uploadBtn.closest('.feature-card');
            const processingSection = featureCard.querySelector('.feature-processing-section');
            const beforeImage = processingSection.querySelector('.feature-before-image');
            const afterImage = processingSection.querySelector('.feature-after-image');
            
            const reader = new FileReader();
            reader.onload = (e) => {
                beforeImage.src = e.target.result;
                afterImage.src = e.target.result;
                processingSection.style.display = 'block';
                initializeFeatureSlider(processingSection.querySelector('.feature-comparison-slider'));
                setupFeatureControls(processingSection, beforeImage, afterImage);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }

    function setupFeatureControls(processingSection, beforeImage, afterImage) {
        const processBtn = processingSection.querySelector('.feature-process-btn');
        const downloadBtn = processingSection.querySelector('.feature-download-btn');
        const enhancementSlider = processingSection.querySelector('.feature-enhancement-slider');

        processBtn.addEventListener('click', async () => {
            try {
                processBtn.classList.add('processing');
                
                const level = enhancementSlider.value;
                
                // Call API to enhance image
                const response = await fetch(`${API_BASE_URL}/enhance`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        image: beforeImage.src,
                        level: parseInt(level)
                    })
                });

                const data = await response.json();
                
                if (data.status === 'success') {
                    afterImage.src = data.enhanced_image;
                } else {
                    throw new Error(data.error || 'Failed to enhance image');
                }
            } catch (error) {
                alert('Error enhancing image: ' + error.message);
            } finally {
                processBtn.classList.remove('processing');
            }
        });

        downloadBtn.addEventListener('click', () => {
            const link = document.createElement('a');
            link.download = 'enhanced-image.png';
            link.href = afterImage.src;
            link.click();
        });
    }

    function initializeFeatureSlider(slider) {
        const handle = slider.querySelector('.slider-handle');
        const beforeImage = slider.querySelector('.feature-before-image');
        let isResizing = false;

        handle.addEventListener('mousedown', startResizing);
        document.addEventListener('mousemove', moveHandle);
        document.addEventListener('mouseup', stopResizing);

        handle.addEventListener('touchstart', startResizing);
        document.addEventListener('touchmove', moveHandle);
        document.addEventListener('touchend', stopResizing);

        function startResizing(e) {
            isResizing = true;
            e.preventDefault();
        }

        function stopResizing() {
            isResizing = false;
        }

        function moveHandle(e) {
            if (!isResizing) return;

            const sliderRect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches?.[0]?.clientX || 0) - sliderRect.left;
            const position = Math.max(0, Math.min(x / sliderRect.width * 100, 100));
            
            handle.style.left = `${position}%`;
            beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
        }

        // Set initial position
        moveHandle({ clientX: slider.getBoundingClientRect().left + slider.offsetWidth / 2 });
    }

    // Upload functionality
    const uploadBox = document.querySelector('.upload-box');
    const uploadBtn = document.querySelector('.upload-btn');
    const processingSection = document.querySelector('.image-processing-section');
    const originalImage = document.getElementById('original-image');
    const enhancedImage = document.getElementById('enhanced-image');
    const processBtn = document.getElementById('process-image');
    const downloadBtn = document.getElementById('download-image');
    const enhancementSlider = document.getElementById('enhancement-level');

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => {
            uploadBox.classList.add('highlight');
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadBox.addEventListener(eventName, () => {
            uploadBox.classList.remove('highlight');
        });
    });

    uploadBox.addEventListener('drop', handleDrop);
    uploadBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            handleFile(file);
        };
        input.click();
    });

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const file = dt.files[0];
        handleFile(file);
    }

    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                originalImage.src = e.target.result;
                enhancedImage.src = e.target.result;
                processingSection.style.display = 'block';
                initializeComparisonSlider(document.querySelector('.comparison-slider-main'));
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    }

    // Process image function using API
    processBtn.addEventListener('click', async () => {
        try {
            processBtn.classList.add('processing');
            
            const level = enhancementSlider.value;
            
            // Call API to enhance image
            const response = await fetch(`${API_BASE_URL}/enhance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: originalImage.src,
                    level: parseInt(level)
                })
            });

            const data = await response.json();
            
            if (data.status === 'success') {
                enhancedImage.src = data.enhanced_image;
            } else {
                throw new Error(data.error || 'Failed to enhance image');
            }
        } catch (error) {
            alert('Error enhancing image: ' + error.message);
        } finally {
            processBtn.classList.remove('processing');
        }
    });

    // Download enhanced image
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'enhanced-image.png';
        link.href = enhancedImage.src;
        link.click();
    });

    // Clipboard paste functionality
    document.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.type.indexOf('image') === 0) {
                const file = item.getAsFile();
                handleFile(file);
            }
        }
    });

    // Comparison slider functionality
    function initializeComparisonSlider(slider) {
        const handle = slider.querySelector('.slider-handle');
        const beforeImage = slider.querySelector('.before-image');
        let isResizing = false;

        handle.addEventListener('mousedown', startResizing);
        document.addEventListener('mousemove', moveHandle);
        document.addEventListener('mouseup', stopResizing);

        // Touch events
        handle.addEventListener('touchstart', startResizing);
        document.addEventListener('touchmove', moveHandle);
        document.addEventListener('touchend', stopResizing);

        function startResizing(e) {
            isResizing = true;
            e.preventDefault();
        }

        function stopResizing() {
            isResizing = false;
        }

        function moveHandle(e) {
            if (!isResizing) return;

            const sliderRect = slider.getBoundingClientRect();
            const x = (e.clientX || e.touches?.[0]?.clientX || 0) - sliderRect.left;
            const position = Math.max(0, Math.min(x / sliderRect.width * 100, 100));
            
            handle.style.left = `${position}%`;
            beforeImage.style.clipPath = `inset(0 ${100 - position}% 0 0)`;

            // Update labels opacity based on slider position
            const labels = slider.querySelectorAll('.slider-label');
            if (labels.length === 2) {
                const [beforeLabel, afterLabel] = labels;
                beforeLabel.style.opacity = position < 30 ? '0' : '1';
                afterLabel.style.opacity = position > 70 ? '0' : '1';
            }
        }

        // Set initial position
        moveHandle({ clientX: slider.getBoundingClientRect().left + slider.offsetWidth / 2 });
    }

    // Initialize all comparison sliders
    document.querySelectorAll('.comparison-slider').forEach(initializeComparisonSlider);

    // Sample images click handler
    const sampleImages = document.querySelectorAll('.image-examples img');
    sampleImages.forEach(img => {
        img.addEventListener('click', async () => {
            try {
                // Add loading state
                img.style.opacity = '0.5';
                img.style.pointerEvents = 'none';
                
                // Create a loading spinner
                const spinner = document.createElement('div');
                spinner.className = 'processing';
                img.parentElement.appendChild(spinner);

                // Load and process the image
                const file = await fetch(img.src)
                    .then(response => response.blob())
                    .then(blob => new File([blob], 'sample.jpg', { type: 'image/jpeg' }));
                
                handleFile(file);

                // Remove loading state
                img.style.opacity = '1';
                img.style.pointerEvents = 'auto';
                spinner.remove();

                // Scroll to the processing section
                document.querySelector('.image-processing-section').scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } catch (error) {
                console.error('Error loading sample image:', error);
                alert('Sorry, there was an error loading the sample image. Please try another image or upload your own.');
                
                // Reset loading state
                img.style.opacity = '1';
                img.style.pointerEvents = 'auto';
                const spinner = img.parentElement.querySelector('.processing');
                if (spinner) spinner.remove();
            }
        });

        // Add tooltip behavior
        img.addEventListener('mouseover', () => {
            img.title = 'Click to use this sample image';
        });
    });

    // Helper function to convert Data URL to File object
    function dataURLtoFile(dataurl, filename) {
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while(n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    // Feedback Form Functionality
    const feedbackForm = document.getElementById('feedback-form');
    const ratingStars = document.querySelectorAll('.rating-stars i');
    const ratingInput = document.getElementById('rating');

    // Star Rating Functionality
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-rating');
            ratingInput.value = rating;
            
            // Update star colors
            ratingStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        // Hover effect
        star.addEventListener('mouseover', () => {
            const rating = star.getAttribute('data-rating');
            ratingStars.forEach(s => {
                if (s.getAttribute('data-rating') <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Reset stars on mouseout
    document.querySelector('.rating-stars').addEventListener('mouseout', () => {
        const rating = ratingInput.value;
        ratingStars.forEach(s => {
            if (s.getAttribute('data-rating') <= rating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });

    // Form Submission using API
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            // Get form data
            const formData = {
                name: document.getElementById('user-name').value,
                email: document.getElementById('user-email').value,
                rating: document.getElementById('rating').value,
                feedback: document.getElementById('feedback-text').value
            };

            // Submit feedback to API
            const response = await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.status === 'success') {
                showFeedbackMessage('Thank you for your feedback! We appreciate your input.', 'success');
                feedbackForm.reset();
                
                // Reset stars
                ratingStars.forEach(star => star.classList.remove('active'));
                ratingInput.value = '';
            } else {
                throw new Error(data.error || 'Failed to submit feedback');
            }
        } catch (error) {
            showFeedbackMessage('Error submitting feedback: ' + error.message, 'error');
        }
    });

    // Helper function to show feedback messages
    function showFeedbackMessage(message, type) {
        // Remove any existing messages
        const existingMessage = document.querySelector('.feedback-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `feedback-message feedback-${type}`;
        messageElement.textContent = message;

        // Add message to form
        feedbackForm.appendChild(messageElement);

        // Remove message after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
}); 