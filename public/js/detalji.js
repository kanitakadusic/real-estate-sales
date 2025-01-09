const carousel = setCarousel(
    document.getElementById('queries-container'),
    document.querySelectorAll('.query')
)

document.getElementById('previous').addEventListener('click', () => carousel.previous());
document.getElementById('next').addEventListener('click', () => carousel.next());