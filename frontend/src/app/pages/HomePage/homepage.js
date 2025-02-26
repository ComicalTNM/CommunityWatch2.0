let index = 0;
        const totalIframes = 5;
        const visibleIframes = 3;
        const carousel = document.getElementById('carousel');

        function scrollRight() {
            if (index < totalIframes - visibleIframes) {
                index++;
                updateCarousel();
            }
        }

        function scrollLeft() {
            if (index > 0) {
                index--;
                updateCarousel();
            }
        }

        function updateCarousel() {
            const shift = -(index * (100 / visibleIframes));
            carousel.style.transform = `translateX(${shift}%)`;
        }