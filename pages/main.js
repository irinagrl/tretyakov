const ROLE = 'admin';
// const ROLE = 'user';
let selection;

///////////////////////////create gallery
function render(paintings) {
    deleteCards();

    for (let i = 0; i < paintings.length; i++) {
        createCard(paintings[i]);
    }
}

render(paintings);

function getCardElement(painting) {
    const cardTemplate = document.querySelector('#card__template').content;
    const cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.card__index').innerText = painting.id;
    cardElement.querySelector('.card__author').innerText = painting.author;
    cardElement.querySelector('.card__title').innerText = painting.title;
    cardElement.querySelector('.card__image').src = painting.src;
    cardElement.querySelector('.card__image').alt = painting.title;

    if (ROLE !== 'admin') {
        cardElement.querySelector('.card__settings').style.display = 'none';
    }

    return cardElement;
}

function createCard(painting) {
    const gallery = document.querySelector('.gallery');
    const cardElement = getCardElement(painting);


    //check if patron is on
    if (document.querySelector('.filter_patron').classList.contains('filtered')) {
        if (painting.patron === false) {
            return;
        }
    }

    //check if dropdown filtered
    if (document.querySelector('.dropdown_cell__title').textContent !== 'автор') {
        let selectedAuthor = document.querySelector('.dropdown_cell__title').textContent
        selectedAuthor = selectedAuthor.split(' ').reverse().join(' ');
        if (painting.author !== selectedAuthor) {
            return;
        }
    }

    //check inline filter
    if (document.querySelector('.filter_inline__cell').classList.contains('filtered')) {
        let filter = document.querySelector('.filter_inline__cell').textContent;
        if (painting.style !== filter) {
            return;
        }
    }

    gallery.appendChild(cardElement);
}

/////////////////////////// create author list for dropdown filter
function createAuthorList() {
    const authors = [];

    for (let i = 0; i < paintings.length; i++) {
        let author = paintings[i].author.split(' ').reverse().join(' ');

        if (!authors.includes(author)) {
            authors.push(author);
        }
    }
    authors.sort();

    for (let i = 0; i < authors.length; i++) {
        createFilterElement(authors[i]);
    }
}

function getAuthor(author) {
    const filterTemplate = document.querySelector('#dropdown_item__template').content;
    const filterElement = filterTemplate.cloneNode(true);

    filterElement.querySelector('.dropdown_item').textContent = author;

    return filterElement;
}

function createFilterElement(author) {
    const filter = document.querySelector('.dropdown_container');
    const filterElement = getAuthor(author);
    filter.appendChild(filterElement);

    return filter;
}

///////////////////////////filter cards
function deleteCards() {
    const gallery = document.querySelector('.gallery');
    const cards = gallery.querySelectorAll('.card');

    for (const card of cards) {
        gallery.removeChild(card);
    }
}

//filter cards by patron option
function patronFilterHandler() {
    document.querySelector('.filter_patron').classList.toggle('filtered');

    if (document.querySelector('.filter_patron').classList.contains('filtered')) {
        document.querySelector('.patron_switch').style.backgroundColor = '#b7976e';
        document.querySelector('.patron_switch__circle').style.backgroundColor = '#b7976e';
        document.querySelector('.patron_switch__circle').style.marginLeft = '18px';

    } else {
        document.querySelector('.patron_switch').style.backgroundColor = '#000';
        document.querySelector('.patron_switch__circle').style.backgroundColor = '#000';
        document.querySelector('.patron_switch__circle').style.marginLeft = '4px';
    }

    render(paintings);
}

// dropdown
function openDropDownHandler() {
    createAuthorList(paintings);
    document.querySelector('.dropdown_cell').classList.add('dropdown_is-open');
    document.querySelector('.dropdown_container').style.display = 'flex';
}

function closeDropDownHandler(evt) {
    if (!evt.target.classList.contains('dropdown_cell')) {
        document.querySelector('.dropdown_container').style.display = 'none';
    }

}

function dropdownHandler(evt) {
    const filter = evt.target.textContent;

    if (filter === 'Все') {
        document.querySelector('.dropdown_cell__title').textContent = 'автор';
    } else {
        document.querySelector('.dropdown_cell__title').textContent = filter;
    }

    document.querySelector('.dropdown_container').style.display = 'none';
    render(paintings);
}

//inline filter
function filterInlineHandler(evt) {
    evt.target.classList.toggle('filtered');

    if (evt.target.classList.contains('filtered')) {
        evt.target.style.backgroundColor = '#b7976e';
    } else {
        evt.target.style.backgroundColor = '#e4dcd5';
    }

    render(paintings);
}

//////////////////// settings popup
function openPopupHandler(evt) {
    const selectedCardPopup = evt.target.closest('.card');
    window.selection = selectedCardPopup;
    document.querySelector('.popup__input_author').value = selectedCardPopup.querySelector('.card__author').textContent;
    document.querySelector('.popup__input_title').value = selectedCardPopup.querySelector('.card__title').textContent;


    if (evt.target.classList.contains('settings__image')) {
        document.querySelector('.popup').style.display = 'flex';
    }
}

function updateCardText(paintings) {
    const selectedCardPopup = window.selection;
    const i = selectedCardPopup.querySelector('.card__index').textContent;
    const authorNewText = document.getElementById('popup_author').value;
    paintings[i - 1].author = authorNewText;
    render(paintings);
}

function closePopupHandler() {
    document.querySelector('.popup').style.display = 'none';

}

function submitPopup(evt) {
    evt.preventDefault();
    updateCardText(paintings);
    document.querySelector('.popup').style.display = 'none';
}

document.querySelector('.filter_inline').addEventListener('click', filterInlineHandler);
document.querySelector('.filter_patron').addEventListener('click', patronFilterHandler);
document.querySelector('.dropdown_container').addEventListener('click', dropdownHandler);
document.querySelector('.dropdown_cell').addEventListener('click', openDropDownHandler);
document.querySelector('.main').addEventListener('click', closeDropDownHandler);
document.querySelector('.gallery').addEventListener('click', openPopupHandler);
document.querySelector('.popup__close').addEventListener('click', closePopupHandler);
document.querySelector('.popup__form').addEventListener('submit', submitPopup);