document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('apply-filters').addEventListener('click', () => {
        loadEvents();
    });
    loadEvents();
    loadGallery();
    setupModal();
    setupMobileMenu();
});

function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
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
                ${event["Event Date"] ? `<div class="absolute top-2 right-2 bg-pink-500 text-white text-sm font-bold py-1 px-2 rounded">${new Date(event["Event Date"]).toLocaleDateString()}</div>` : ''}
                <h3 class="text-2xl font-bold mb-2">${event["Event Name"]}</h3>
                ${event["Ticket Link"] ? `<a href="${event["Ticket Link"]}" class="mt-4 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">Get My Ticket</a>` : ''}
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
                pageButton.classList.add('bg-pink-500');
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
