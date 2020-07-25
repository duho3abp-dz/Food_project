function slider() {
    const stringToNumber = (str) => +str.replace(/\D/g, '');

    const slider = document.querySelector('.offer__slider'),
        slidesWrapper = slider.querySelector('.offer__slider-wrapper'),
        slidesField = slidesWrapper.querySelector('.offer__slider-inner'),
        slides = slidesField.querySelectorAll('.offer__slide'),
        nextBtn = slider.querySelector('.offer__slider-next'),
        prevBtn = slider.querySelector('.offer__slider-prev'),
        current = slider.querySelector('#current'),
        total = slider.querySelector('#total'),
        width = stringToNumber(window.getComputedStyle(slidesWrapper).width),
        carouselIndicators = document.createElement('div');
    let slideIndex = 1,
        offset = 0;

    const transformSlider = (o, i, dots, dot) => {
        slidesField.style.transform = `translateX(-${o}px)`;
        i < 10 ? current.textContent = `0${i}` : current.textContent = i;
        dots.forEach(dot => dot.style.opacity = '');
        dot.style.opacity = 1;
    };

    slides.length < 10 ? total.textContent = `0${slides.length}` : total.textContent = slides.length;
    slideIndex < 10 ? current.textContent = `0${slideIndex}` : current.textContent = slideIndex;

    slider.style.position = 'relative';
    slidesWrapper.style.overflow = 'hidden';
    slidesField.style.width = `${100 * slides.length}%`;
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';
    slides.forEach(slide => {
        slide.style.width = `${width}px`;
    });
    carouselIndicators.classList.add('carousel-indicators');

    const dots = [];
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('div');

        if (i == slideIndex - 1) {
            dot.style.opacity = '1';
        }

        dot.classList.add('dot');
        dot.setAttribute('id', `${i}`);
        carouselIndicators.append(dot);
        dots.push(dot);
    }

    slider.append(carouselIndicators);

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            offset = dot.id * width;
            slideIndex = +dot.id + 1;

            transformSlider(offset, slideIndex, dots, dot);
        });
    });

    nextBtn.addEventListener('click', () => {

        if (offset == width * (slides.length - 1)) {
            offset = 0;
            slideIndex = 1;
        } else {
            offset += width;
            slideIndex++;
        }

        transformSlider(offset, slideIndex, dots, dots[slideIndex - 1]);
    });

    prevBtn.addEventListener('click', () => {

        if (offset == 0) {
            offset = width * (slides.length - 1);
            slideIndex = slides.length;
        } else {
            offset -= width;
            slideIndex--;
        }

        transformSlider(offset, slideIndex, dots, dots[slideIndex - 1]);
    });
}
module.exports = slider;