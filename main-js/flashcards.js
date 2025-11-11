let collections = JSON.parse(localStorage.getItem('collections')) || [];




const titre_coll = document.getElementById('titre-coll');
const btn_add_coll = document.getElementById('btn-add-coll');
const select_coll = document.getElementById('select-coll');
const add_qst = document.getElementById('add-qst');
const add_repense = document.getElementById('add-repense');
const btn_add_cards = document.getElementById('btn-add-card');
const mes_collections = document.getElementById('mes-collections');
const sec_flashcards = document.getElementById('sec-flashcards');
const titre_coll_select = document.getElementById('titre-coll-select');
const back_btn = document.getElementById('back-btn');


const flashcard = document.getElementById('flashcard');
const facefont = flashcard.querySelector('.card-face-front');
const faceback = flashcard.querySelector('.card-face-back');
const questiontext = document.getElementById('question');
const repensetext = document.getElementById('reponse');
const contor = document.getElementById('contor');
const prec_btn = document.getElementById('prec-btn');
const suiv_btn = document.getElementById('suiv-btn');



document.addEventListener('DOMContentLoaded', function () {
    loadCollections();
    createselect_coll();
    afficheCollections();

    btn_add_coll.addEventListener('click', addCollection);
    btn_add_cards.addEventListener('click', addCard);
    back_btn.addEventListener('click', showCollections);

    facefont.addEventListener('click', flipCard);
    faceback.addEventListener('click', flipCard);
    suiv_btn.addEventListener('click', nextCard);
    prec_btn.addEventListener('click', precCard);
});

function loadCollections() {
    const storedCollections = localStorage.getItem('collections');
    if (storedCollections) {
        collections = JSON.parse(storedCollections);
    }
}

// pour collections

function saveCollections() {
    localStorage.setItem('collections', JSON.stringify(collections));
}

function addCollection() {}

function createselect_coll() {
    select_coll.innerHTML = '<option value="">Selectionnez une collection</option>';

    // Ajouter les collections
    collections.forEach((collection, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = collection.title;
        select_coll.appendChild(option);
    });
}

function afficheCollections() {

    mes_collections.innerHTML = '';

    if (collections.length === 0) {
        mes_collections.innerHTML = `
                    <div class="col-span-full bg-white rounded-xl shadow-md border border-gray-500 p-6 text-center">
                        <div class="flex items-center justify-center mb-4">
                            <h3 class="font-semibold text-gray-800">Aucune collection pour le moment</h3>
                        </div>
                        <p class="text-gray-600 text-sm">Créez votre première collection pour commencer</p>
                    </div>
                `;
        return;
    }

}



//pour cards

function addCard(){}

function showFlashcards(){}

function showCollections(){}

function nextCard(){}

function precCard(){}

function flipCard() {
    flashcard.classList.toggle('is-flipped');
}