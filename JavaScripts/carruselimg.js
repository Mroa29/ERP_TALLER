document.getElementById('imageUpload').addEventListener('change', function(event) {
    const files = event.target.files;
    const carouselInner = document.getElementById('carouselInner');
    const carouselIndicators = document.getElementById('carouselIndicators');

    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const div = document.createElement('div');
            div.className = 'carousel-item' + (carouselInner.children.length === 0 ? ' active' : '');
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'd-block w-100';
            div.appendChild(img);
            carouselInner.appendChild(div);

            // Create indicator
            const indicator = document.createElement('li');
            indicator.setAttribute('data-target', '#uploadedImagesCarousel');
            indicator.setAttribute('data-slide-to', carouselInner.children.length - 1);
            if (carouselIndicators.children.length === 0) {
                indicator.className = 'active';
            }
            carouselIndicators.appendChild(indicator);
        }
        reader.readAsDataURL(files[i]);
    }
});