let carouselControl = postaviCarousel(
    document.getElementById("carousel-placeholder"),
    document.getElementsByClassName("upit")
)

document.getElementById("carousel-prev").addEventListener("click", () => {
    carouselControl.fnLijevo();
});

document.getElementById("carousel-next").addEventListener("click", () => {
    carouselControl.fnDesno();
});