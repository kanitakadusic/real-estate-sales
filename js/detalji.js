let upiti_originalContent = document.getElementById('upiti').innerHTML;
let mediaQuery = window.matchMedia('(min-width: 600px)');

let carousel = postaviCarousel(
    document.getElementById('upiti'),
    document.querySelectorAll('.upit')
)

function handleWidthChange(event) {
    if (event.matches) {
        document.getElementById('upiti').innerHTML = upiti_originalContent;
    } else {
        carousel.fnDesno();
        carousel.fnLijevo();
    }
}

handleWidthChange(mediaQuery);

document.getElementById('carousel-prev').addEventListener('click', () => carousel.fnLijevo());
document.getElementById('carousel-next').addEventListener('click', () => carousel.fnDesno());

mediaQuery.addEventListener('change', handleWidthChange);