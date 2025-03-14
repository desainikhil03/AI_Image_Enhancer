document.addEventListener('DOMContentLoaded', () => {
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

    // Process image function
    processBtn.addEventListener('click', () => {
        processBtn.classList.add('processing');
        
        // Simulate image processing with a blur effect
        const level = enhancementSlider.value;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            // Apply enhancement effect (for demo, we'll just adjust brightness and contrast)
            ctx.filter = `brightness(${100 + level * 10}%) contrast(${100 + level * 5}%)`;
            ctx.drawImage(img, 0, 0);
            
            setTimeout(() => {
                enhancedImage.src = canvas.toDataURL();
                processBtn.classList.remove('processing');
            }, 1000); // Simulate processing time
        };
        
        img.src = originalImage.src;
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
        img.addEventListener('click', () => {
            handleFile(dataURLtoFile(img.src, 'sample.jpg'));
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
}); 