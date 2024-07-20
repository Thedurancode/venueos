document.addEventListener('DOMContentLoaded', function () {
    const applyFiltersButton = document.getElementById('apply-filters');
    if (applyFiltersButton) {
        applyFiltersButton.addEventListener('click', () => {
            loadEvents();
        });
    }
    loadEvents();
    loadGallery();
    setupModal();
    setupHeroSlider();
    setupVideoSlider();

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('fade-in');
        } else {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        });
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('fade-in');
        } else {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        });
    });
});

function setupVideoSlider() {
    const videoData = [
        { id: 1, thumbnail: 'path/to/thumbnail1.jpg', videoUrl: 'path/to/video1.mp4' },
        { id: 2, thumbnail: 'path/to/thumbnail2.jpg', videoUrl: 'path/to/video2.mp4' },
        { id: 3, thumbnail: 'path/to/thumbnail3.jpg', videoUrl: 'path/to/video3.mp4' },
        { id: 4, thumbnail: 'path/to/thumbnail4.jpg', videoUrl: 'path/to/video4.mp4' },
        { id: 5, thumbnail: 'path/to/thumbnail5.jpg', videoUrl: 'path/to/video5.mp4' },
    ];

    const videoContainer = document.querySelector('.video-container');
    const prevButton = document.getElementById('prev-video');
    const nextButton = document.getElementById('next-video');
    let currentIndex = 0;

    function createVideoItem(video) {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');
        videoItem.innerHTML = `
            <img src="${video.thumbnail}" alt="Video Thumbnail">
            <div class="play-button"></div>
        `;
        videoItem.addEventListener('click', () => playVideo(video.videoUrl));
        return videoItem;
    }

    function updateSlider() {
        videoContainer.innerHTML = '';
        for (let i = currentIndex; i < currentIndex + 3; i++) {
            const index = i % videoData.length;
            videoContainer.appendChild(createVideoItem(videoData[index]));
        }
    }

    function playVideo(videoUrl) {
        // Implement video playback logic here
        console.log('Playing video:', videoUrl);
        // You can use a modal or a video player library to play the video
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + videoData.length) % videoData.length;
        updateSlider();
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % videoData.length;
        updateSlider();
    });

    updateSlider();
}

function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const controls = document.querySelectorAll('.hero-control');
    let currentSlide = 0;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        controls[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        controls[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide((currentSlide + 1) % slides.length);
    }

    controls.forEach((control, index) => {
        control.addEventListener('click', () => showSlide(index));
    });

    setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

async function loadEvents(page = 1) {
    try {
        const itemsPerPage = 12;
        const offset = (page - 1) * itemsPerPage;
        
        // Get filter values
        const genre = document.getElementById('genre-filter').value;
        const state = document.getElementById('state-filter').value;

        // NoCodeDB API endpoint and token
        const nocodbApiEndpoint = 'https://nocodb-sc4kso4.smokesms.com/api/v2/tables/m3qz7w46yx23r3z/records';
        const nocodbApiToken = 'xdlsuG2Khv0-YRxodE2eoW_E3R1B_h0Ywneiaw1j';
        
        const config = {
            headers: {
                'xc-token': nocodbApiToken
            }
        };

        // Build the where query for filtering
        let where = '';
        if (genre) where += `genre,eq,${genre}`;
        if (state) where += (where ? ',' : '') + `state,eq,${state}`;

        // Fetch events from NoCodeDB
        const response = await axios.get(`${nocodbApiEndpoint}?offset=${offset}&limit=${itemsPerPage}&where=${where}`, config);
        const events = response.data.list;
        const totalRows = response.data.pageInfo.totalRows;

        // Get the event grid container
        const eventGrid = document.getElementById('event-grid');

        // Clear the event grid container
        eventGrid.innerHTML = '';

        // Iterate over the events and create event cards
        events.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card', 'relative', 'p-6', 'bg-gray-800', 'rounded-lg', 'shadow-lg', 'transition', 'duration-300', 'ease-in-out', 'transform', 'hover:scale-105');

            // Extract event image URL if available
            let eventImageUrl = '';
            if (event["Event Image"] && event["Event Image"].length > 0) {
                eventImageUrl = `https://nocodb-sc4kso4.smokesms.com/${event["Event Image"][0].signedPath}`;
            }

            eventCard.innerHTML = `
                ${eventImageUrl ? `<div class="relative mb-4 w-full h-64 overflow-hidden rounded-lg event-image-container"><img src="${eventImageUrl}" alt="${event["Event Name"]}" class="w-full h-full object-contain event-image"></div>` : ''}
                ${event["Event Date"] ? `<div class="absolute top-2 right-2 bg-green-500 text-white text-sm font-bold py-1 px-2 rounded">${new Date(event["Event Date"]).toLocaleDateString()}</div>` : ''}
                <h3 class="text-2xl font-bold mb-2">${event["Event Name"]}</h3>
                ${event["Ticket Link"] ? `<a href="${event["Ticket Link"]}" class="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Get My Ticket</a>` : ''}
            `;

            eventGrid.appendChild(eventCard);
        });

        // Handle pagination
        const totalPages = Math.ceil(totalRows / itemsPerPage);
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('mx-1', 'px-3', 'py-2', 'rounded', 'bg-gray-700', 'text-white', 'hover:bg-gray-600', 'transition', 'duration-300');
            pageButton.textContent = i;
            if (i === page) {
                pageButton.classList.add('bg-green-500');
            }
            pageButton.addEventListener('click', () => {
                loadEvents(i);
                document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
            });
            pagination.appendChild(pageButton);
        }
    } catch (error) {
        console.error('Error loading events:', error);
    }
}

async function loadGallery() {
    try {
        // NoCodeDB API endpoint and token
        const nocodbApiEndpoint = 'https://nocodb-sc4kso4.smokesms.com/api/v2/tables/mfpmk0lxj4x0hkl/records?limit=25&shuffle=0&offset=0';
        const nocodbApiToken = 'xdlsuG2Khv0-YRxodE2eoW_E3R1B_h0Ywneiaw1j';
        
        const config = {
            headers: {
                'xc-token': nocodbApiToken,
                'accept': 'application/json'
            }
        };

        // Fetch gallery images from NoCodeDB
        const response = await axios.get(nocodbApiEndpoint, config);
        const images = response.data.list;

        // Get the gallery container
        const galleryContainer = document.getElementById('gallery-container');

        // Clear the gallery container
        galleryContainer.innerHTML = '';

        // Iterate over the images and create image cards
        images.forEach(image => {
            if (image["Image URL"] && image["Image URL"].length > 0) {
                const imgCard = document.createElement('div');
                imgCard.classList.add('relative', 'mb-4', 'w-full', 'h-64', 'overflow-hidden', 'rounded-lg', 'shadow-lg', 'cursor-pointer');

                let imgUrl = `https://nocodb-sc4kso4.smokesms.com/${image["Image URL"][0].signedPath}`;
                imgCard.innerHTML = `<img src="${imgUrl}" alt="${image["PHOTO NAME"] || 'Gallery Image'}" class="w-full h-full object-cover">`;

                imgCard.addEventListener('click', () => openModal(imgUrl));

                galleryContainer.appendChild(imgCard);
            }
        });
    } catch (error) {
        console.error('Error loading gallery images:', error);
    }
}

function setupModal() {
    const modal = document.getElementById('modal');
    const modalImg = modal.querySelector('img');
    const modalClose = document.querySelector('.modal-close');

    modalClose.addEventListener('click', () => closeModal());

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    function openModal(imgUrl) {
        modalImg.src = imgUrl;
        modal.classList.add('open');
    }

    function closeModal() {
        modal.classList.remove('open');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('fade-in');
        } else {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        });
    });

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you would typically send this data to a server
            console.log('Form submitted:', { name, email, message });
            
            // For now, we'll just show an alert
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

    mobileMenuButton.addEventListener('click', function() {
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('fade-in');
        } else {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        }
    });

    // Close mobile menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('fade-out');
            setTimeout(() => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('fade-out');
            }, 300);
        });
    });
