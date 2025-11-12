let collections = JSON.parse(localStorage.getItem('collections')) || [];
let collectionsTmp = -1;
let cardsTmp = 0;
let count = 0;



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

function addCollection() {

    const title = titre_coll.value.trim();

    if (!title) {
        alert('veuillez entrer un titre pour la collection');
        return;
    }

    if (collections.some(n => n.title === title)) {
        alert('Une collection avec ce nom existe dejà');
        return;
    }

    const newCollection = { title: title, cards: [] };

    collections.push(newCollection);
    saveCollections();
    createselect_coll();
    afficheCollections();

    titre_coll.value = '';

}

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

function showCollections() {
    sec_flashcards.classList.add('hidden');
    collectionsTmp = -1;
}

function afficheCollections() {

    mes_collections.innerHTML = '';

    if (collections.length === 0) {
        mes_collections.innerHTML = `
                    <div class="col-span-full bg-white rounded-xl shadow-md border border-gray-500 p-6 text-center">
                        <div class="flex items-center justify-center mb-4">
                            <h3 class="font-semibold text-gray-800">Aucune collection pour le moment</h3>
                        </div>
                        <p class="text-gray-600 text-sm">Creez votre première collection pour commencer</p>
                    </div>
                `;
        return;
    }

    collections.forEach((collection, index) => {
        const collectionElement = document.createElement('div');
        collectionElement.className = 'col-span-full bg-white rounded-xl shadow-md border border-gray-500 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer collection-item';
        collectionElement.innerHTML = `
                    <button class="delete-btn" data-index="${index}">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="flex items-center mb-4">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <i class="fas fa-folder text-blue-500"></i>
                        </div>
                        <h3 class="font-bold text-[#263973]">${collection.title}</h3>
                    </div>
                    <p class="text-gray-600 text-sm">${collection.cards.length} carte(s)</p>
                `;

        collectionElement.addEventListener('click', (e) => {
            if (!e.target.closest('.delete-btn')) {
                showFlashcards(index);
            }
        });

        const deleteBtn = collectionElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteCollection(index);
        });

        mes_collections.appendChild(collectionElement);
    });

}

function deleteCollection(index) {

    collections.splice(index, 1);
    saveCollections();
    createselect_coll();
    afficheCollections();

    if (collectionsTmp === index) {
        showCollections();
    }
}



//pour cards

function addCard() {
    const collectionIndex = parseInt(select_coll.value);
    const question = add_qst.value.trim();
    const reponse = add_repense.value.trim();

    if (collectionIndex === '' || isNaN(collectionIndex)) {
        alert('veuillez selectionner une collection');
        return;
    }

    if (!question || !reponse) {
        alert('veuillez entrer la question et la reponse');
        return;
    }

    collections[collectionIndex].cards.push({
        question: question,
        reponse: reponse
    });

    saveCollections();
    afficheCollections();

    add_qst.value = '';
    add_repense.value = '';

}

function showFlashcards(collectionIndex) {
    collectionsTmp = collectionIndex;
    cardsTmp = 0;

    titre_coll_select.textContent = collections[collectionIndex].title;

    contorCard();

    sec_flashcards.classList.remove('hidden');

    sec_flashcards.scrollIntoView({ behavior: 'smooth' });
}

function contorCard() {
    if (collectionsTmp === -1 || collections[collectionsTmp].cards.length === 0) {
        questiontext.textContent = "Aucune carte dans cette collection";
        repensetext.textContent = "Ajoutez des cartes pour commencer";
        contor.textContent = "Carte 0 / 0";
        return;
    }

    const card = collections[collectionsTmp].cards[cardsTmp];
    questiontext.textContent = card.question;
    repensetext.textContent = card.reponse;
    contor.textContent = `Carte ${cardsTmp + 1} / ${collections[collectionsTmp].cards.length}`;

    flashcard.classList.remove('is-flipped');
}

function nextCard() {

    if (cardsTmp < collections[collectionsTmp].cards.length-1 ) {

        cardsTmp++ ;
        contorCard();
    }

}

function precCard() {

    if (cardsTmp > 0) {
        cardsTmp-- ;
        contorCard();
    }

}

function flipCard() {
    flashcard.classList.toggle('is-flipped');
}