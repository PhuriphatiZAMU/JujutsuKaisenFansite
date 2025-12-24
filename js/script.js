function loadTemplate(url, elementId) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = data;
            } else {
                console.error(`Element with id '${elementId}' not found.`);
            }
        });
}

function main() {
    // All templates are loaded, now execute the rest of the script
    const carouselData = [
        { id: 0, img: 'Photo/Kay-Visual/Jujutsu-Kaisen-0-Key-Visual.jpg', bg: 'https://images6.alphacoders.com/120/1200429.jpg' },
        { id: 1, img: 'Photo/Kay-Visual/Jujutsu-Kaisen-Kay-Visual.jpg', bg: 'https://images5.alphacoders.com/126/1262882.jpg' },
        { id: 2, img: 'Photo/Kay-Visual/Jujutsu-Kaisen-Hidden-Inventory-Premature-Death-Arc-Kay-Visual.webp', bg: 'https://wallpapercave.com/wp/wp12526882.jpg' },
        { id: 3, img: 'Photo/Kay-Visual/Jujutsu-Kaisen-Shibuya-Incident-Arc-Kay-Visual.webp', bg: 'https://external-preview.redd.it/jujutsu-kaisen-season-2-new-key-visual-revealed-for-shibuya-v0-uZxKhx5yBcH9sLn2Ng50x5Rlwvj0pR2edqD4nXv3nqg.jpg?auto=webp&s=19b8c5ddeb474a4a0d84729e921c4867a4101074' },
        { id: 4, img: 'Photo/Kay-Visual/Jujutsu-Kaisen-The-Culling-Game-Arc-Kay-Visual.jpeg', bg: 'https://cdn.oneesports.gg/cdn-data/2023/12/Anime_JujutsuKaisen_Season2_ClosingTheGate_Finale_Yuji.jpg' }
    ];

    let currentIndex = 0;
    let autoPlayTimer;

    // This needs to be delegated since the elements are loaded dynamically
    $(document).on("click", ".hamburger-container", function() {
        $(".hamburger").toggleClass("open"); // Animate Icon
        $(".mobile-dropdown").slideToggle("fast"); // Slide Dropdown
    });

    $(document).on("click", ".mobile-dropdown a", function() {
        $(".hamburger").removeClass("open");
        $(".mobile-dropdown").slideUp("fast");
    });


    // Active nav link highlighting
    const currentPage = window.location.pathname.split("/").pop();
    if (currentPage === "" || currentPage === "index.html") {
        $("#d-nav-home, #m-nav-home").addClass("active");
    } else if (currentPage === "arc.html" || currentPage.startsWith("arc")) {
        $("#d-nav-arc, #m-nav-arc").addClass("active");
    } else if (currentPage === "character.html") {
        $("#d-nav-character, #m-nav-character").addClass("active");
    } else if (currentPage === "contact.html") {
        $("#d-nav-contact, #m-nav-contact").addClass("active");
    }

    // Init App logic for home page
    if (currentPage === "" || currentPage === "index.html") {
        const homeCarousel = document.getElementById('home-carousel');
        if (homeCarousel){
            renderCarousel();
            updateCarousel();

            const wrapper = document.querySelector('.carousel-wrapper');
            if (wrapper) {
                wrapper.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
                wrapper.addEventListener('mouseleave', startAutoPlay);
            }
            startAutoPlay();
            updateBg(currentIndex);
        }
    }

    function renderCarousel() {
        const container = document.getElementById('home-carousel');
        const dotsContainer = document.getElementById('carousel-dots');
        if (!container || !dotsContainer) return;

        container.innerHTML = '';
        dotsContainer.innerHTML = '';
        carouselData.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            slide.innerHTML = `<img src="${item.img}" alt="Slide ${index}">`;
            slide.onclick = () => { goToSlide(index); };
            container.appendChild(slide);
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.onclick = () => { goToSlide(index); };
            dotsContainer.appendChild(dot);
        });
    }

    function updateCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if(slides.length === 0) return;
        const dots = document.querySelectorAll('.dot');
        const bgLayer = document.getElementById('bg-layer');
        const homeElement = document.getElementById('home');

        if (homeElement && homeElement.classList.contains('active')) {
           bgLayer.style.backgroundImage = `url('${carouselData[currentIndex].bg}')`;
        }
        slides.forEach((slide, index) => {
            slide.className = 'carousel-slide hidden';
            dots[index].classList.remove('active');
            if (index === currentIndex) {
                slide.className = 'carousel-slide active';
                dots[index].classList.add('active');
            } else if (index === (currentIndex - 1 + carouselData.length) % carouselData.length) {
                slide.className = 'carousel-slide prev';
            } else if (index === (currentIndex + 1) % carouselData.length) {

                slide.className = 'carousel-slide next';
            }
        });
    }

    function updateBg(index) {
         const bgLayer = document.getElementById('bg-layer');
         if(bgLayer && carouselData[index]) {
             bgLayer.style.backgroundImage = `url('${carouselData[index].bg}')`;
         }
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
        resetAutoPlay();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % carouselData.length;
        updateCarousel();
    }

    function startAutoPlay() {
        clearInterval(autoPlayTimer);
        autoPlayTimer = setInterval(nextSlide, 4000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayTimer);
        startAutoPlay();
    }
}


document.addEventListener("DOMContentLoaded", function() {
    Promise.all([
        loadTemplate('templates/header.html', 'header-placeholder'),
        loadTemplate('templates/nav.html', 'nav-placeholder'),
        loadTemplate('templates/footer.html', 'footer-placeholder')
    ]).then(main).catch(error => console.error("Error loading templates:", error));
});

