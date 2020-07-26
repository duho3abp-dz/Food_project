'use strict';

import tabs from './modules/tabs';
import timer from './modules/timer';
import modal from './modules/modal';
import cards from './modules/cards';
import forms from './modules/forms';
import slider from './modules/slider';
import calc from './modules/calc';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    timer('.timer', '2020-08-21');
    modal('[data-modal]', '.modal', modalTimerId);
    cards();
    forms('form', '.modal__content', 'form', modalTimerId);
    calc();
    slider({
        sliderSelector: '.offer__slider',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner',
        container: '.offer__slide',
        next: '.offer__slider-next',
        prev: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current'
    });

});