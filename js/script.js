'use strict';

window.addEventListener('DOMContentLoaded', () => {

    // Табы на стартовой странице ------------------------------------------------------------------
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.remove('show', 'fade');
            item.classList.add('hide');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    tabsParent.addEventListener('click', e => {
        const target = e.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {

                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }

            });

        }
    });

    hideTabContent();
    showTabContent();

    // Таймера обратного отсчета ------------------------------------------------------------------
    const deadline = '2020-08-21';

    const getTimeRemaining = (endTime) => {
        const t = Date.parse(endTime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / (1000 * 60)) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            total: t,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        };
    };

    const getZero = (num) => {
        if (num >= 0 && num < 10) {
            num = '0' + num;
            return num;
        } else {
            return num;
        }
    };

    const setClock = (selector, endtime) => {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.days);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
        updateClock();
    };

    setClock('.timer', deadline);

    // Модальное окно ------------------------------------------------------------------
    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    const openModal = () => {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';

        clearInterval(modalTimerId);
    };

    const closeModal = () => {
        modal.classList.remove('show');
        modal.classList.add('hide');
        document.body.style.overflow = '';
    };

    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modal.addEventListener('click', e => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', e => {
        if (e.keyCode == 27 && modal.classList.contains('show')) {
            closeModal();
        }
    });

    const showModalByScrollEnd = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            openModal();
            window.removeEventListener('scroll', showModalByScrollEnd);
        }
    };

    window.addEventListener('scroll', showModalByScrollEnd);

    const modalTimerId = setTimeout(openModal, 50000);

    // Шаблонизируем карточки с меню ------------------------------------------------------------------
    const getResource = async url => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    class MenuCard {
        constructor(picture, alt, title, text, price, parentSelector, ...newClass) {
            this.picture = picture;
            this.alt = alt;
            this.title = title;
            this.text = text;
            this.price = price;
            this.parentSelector = document.querySelector(parentSelector);
            this.rate = 71.81;
            this.changeToRUR();
            this.newClass = newClass;
        }

        changeToRUR() {
            this.price = Math.floor(this.price * this.rate);
        }

        render() {
            const div = document.createElement('div');

            if (this.newClass.length === 0) {
                this.newClass = 'menu__item';
                div.classList.add(this.newClass);
            } else {
                this.newClass.forEach(item => {
                    div.classList.add(item);
                });
            }

            div.innerHTML = `
                <img src="${this.picture}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                <div class="menu__item-descr">${this.text}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
                </div>
            `;
            this.parentSelector.append(div);
        }
    }

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({
                img,
                altimg,
                title,
                descr,
                price
            }) => {
                new MenuCard(img, altimg, title, descr, price, '[data-menu]', 'menu__item')
                    .render();
            });
        });

    // Скрипт отправки данных форм на сервер ------------------------------------------------------------------

    const forms = document.querySelectorAll('form'),
        modalContent = document.querySelector('.modal__content'),
        formContent = modalContent.querySelector('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо, скоро мы с вами свяжемся!',
        failure: 'Что-то пошло не так...'
    };

    const showThanksModal = message => {
        openModal();
        formContent.classList.remove('show');
        formContent.classList.add('hide');

        const showContent = document.createElement('div');
        showContent.classList.add('modal__content');

        showContent.textContent = message;
        modalContent.append(showContent);

        setTimeout(() => {
            formContent.classList.remove('hide');
            formContent.classList.add('show');
            showContent.remove();
            closeModal();
        }, 2000);
    };

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    const bindPostData = form => {
        form.addEventListener('submit', e => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
                .then(data => {
                    console.log(data);
                    showThanksModal(message.success);
                })
                .catch(() => {
                    showThanksModal(message.failure);
                })
                .finally(() => {
                    form.reset();
                    statusMessage.remove();
                });
        });
    };

    forms.forEach(form => {
        bindPostData(form);
    });

    // Слайдер ------------------------------------------------------------------
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

    // Калькулятор ------------------------------------------------------------------

    const result = document.querySelector('.calculating__result span');
    let sex, height, weight, age, ratio;

    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    const initCalc = (parent, info, active) => {
        const elements = document.querySelectorAll(`${parent} div`);
        elements.forEach(elem => elem.classList.remove(active));

        elements.forEach(elem => {
            if (elem.getAttribute('id') == info){
                elem.classList.add(active);
            }
            if (elem.getAttribute('data-ratio') == info){
                elem.classList.add(active);
            }
        });
    };

    const calcTotal = () => {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '_____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.floor((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.floor((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    };

    const getStaticInfo = (parentSelector, activeClass) => {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        elements.forEach(elem => {
            elem.addEventListener('click', e => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }

                elements.forEach(elem => elem.classList.remove(activeClass));
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });
    };

    const getDynamicInfo = (selector) => {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (/\d/.test(+input.value)) {
                input.style.background = '';
                switch (input.getAttribute('id')) {
                    case 'height':
                        height = +input.value;
                        break;
                    case 'weight':
                        weight = +input.value;
                        break;
                    case 'age':
                        age = +input.value;
                        break;
                }
            } else {
                input.style.background = 'rgb(212, 96, 96)';
            }

            calcTotal();
        });
    };

    calcTotal();
    initCalc('#gender', sex, 'calculating__choose-item_active');
    initCalc('.calculating__choose_big',ratio, 'calculating__choose-item_active');
    getStaticInfo('#gender', 'calculating__choose-item_active');
    getStaticInfo('.calculating__choose_big', 'calculating__choose-item_active');
    getDynamicInfo('#height');
    getDynamicInfo('#weight');
    getDynamicInfo('#age');

});