'use strict';

window.addEventListener('DOMContentLoaded', () => {
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
});



//  Мой вариант выполнения данной задачи! ----------------------------------------------------

// window.addEventListener('DOMContentLoaded', () => {
//     const allTabs = document.querySelectorAll('.tabcontent'),
//           allPointsMenu = document.querySelectorAll('.tabheader__item');

//     const seeTab = (tabs, num) => {
//         tabs.forEach((tab, i) => {
//             if (num == i) {
//                 tab.classList.add('active_tab');
//             } else {
//                 tab.classList.remove('active_tab');
//             }
//         });
//     };

//     const addMenuClass = (links, num) => {
//         links.forEach((link, i) => {
//             if (num == i) {
//                 link.classList.add('tabheader__item_active');
//             } else {
//                 link.classList.remove('tabheader__item_active');
//             }
//         });
//     };

//     allPointsMenu.forEach((point, i) => {
//         point.addEventListener('click', () => {

//             addMenuClass(allPointsMenu, i);
//             seeTab(allTabs, i);

//         });
//     });

// });