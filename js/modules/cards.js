'use strict';
import {getResource} from '../services/services';

function cards() {    

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
}
export default cards;