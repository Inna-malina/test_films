import films from '/film.js';


let loginForm = document.querySelector('.login-form');
let loginButton = document.querySelector('.login-form__submit');
let loginErrorMsg = document.querySelector('.login-error__msg');
let loginModalWindow = document.querySelector('.login__modal-window');

loginButton.addEventListener("click", function(e) {
   
    let username = loginForm.value;
    let password = loginForm.value;

    if (username != "" && password != "") {
        loginModalWindow.classList.remove('login__modal-window');
        loginModalWindow.classList.add('hidden');
    } else {
        loginErrorMsg.style.opacity = 1;
    }
});


//по клику на кнопку появляется блок для редакции
let btnEdit = document.querySelector('.button-location__button');
let resaltBox = document.querySelector('.resalt-box__create-location');

btnEdit.addEventListener('click', function (e) {
    e.preventDefault();
    resaltBox.classList.remove('notactive');
    resaltBox.classList.add('active');
});


// Формирование списка фильмов
let btnAdd = document.querySelector('.resalt-box__button');
let inpFilm = document.querySelector('.resalt-box__title-location');
let listContaner = document.querySelector('.resalt-box__list');

btnAdd.addEventListener('click', function (e) {
    e.preventDefault();

    //формируем блок под строчку название фильма+корзина
    let listBox = document.createElement('div');
    listBox.className = 'list__resalt-box';
    listBox.setAttribute('data-film', inpFilm.value);
    listContaner.prepend(listBox);

    //формируем option с названием фильма
    let selectFilm = document.querySelector('.contaner__location select');
    let optionFilm = document.createElement('option');
    optionFilm.setAttribute('data-film', inpFilm.value);
    optionFilm.textContent = inpFilm.value;
    selectFilm.append(optionFilm);

    //формируем текстовый блок
    let textElem = document.createElement('div');
    textElem.className = 'resalt-box__element';
    textElem.textContent = inpFilm.value;
    listBox.prepend(textElem);

    //формируем корзинку
    let basket = document.createElement('i');
    basket.className = 'icon-shopping-basket';
    basket.setAttribute('data-film', inpFilm.value);
    listBox.append(basket);

    inpFilm.value = '';

    let elemBoxes = document.querySelectorAll('.list__resalt-box');
    let elemOptions = document.querySelectorAll('.contaner__location select option');


    //удаление блока с фильмом+корзина
    basket.addEventListener('click', function (event) {
        for (let i = 0; i < elemBoxes.length; i++) {
            for (let o = 0; o < elemOptions.length; o++) {
                if (event.target.dataset.film == elemBoxes[i].dataset.film && event.target.dataset.film == elemOptions[o].dataset.film) {
                    console.log();
                    elemBoxes[i].remove();
                    elemOptions[o].remove();
                }
            }

        }
    });

});

//вывод информации о фильмах
let listNameFilms = document.querySelector('.contaner__location select');
let datattrs = document.querySelectorAll('[data-info]');


listNameFilms.addEventListener('change', function () {
    let opt = listNameFilms.value;

    for (let key in films) {
        if (opt == key) {

            let socket = new WebSocket("ws://185.246.65.199:8888");
            socket.onopen = function (e) {
                let opr = {};
                opr["operation"] = 'getToken';
                socket.send(JSON.stringify(opr));
            };
            //получение сообщения в консоль с информацией о выбранном фильме
            socket.onmessage = function (ev) {
                let obj = films[key];
                console.log(obj);
            };

            //заполнение таблицы с инфо о фильме
            for (let elem in films[key]) {
                datattrs.forEach(function (attr) {
                    if (attr.dataset.info == elem) {
                        attr.textContent = films[key][elem];
                    }
                });
            }
        }
    }

});
