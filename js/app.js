const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

/*----- state variables -----*/
let scores = { player: 0, dealer: 0 }; // score keeper
let decide; // player & dealer hit/stand 
let winner; // who won that round 
let playerHand = []; // starting cards for player
let dealerHand = []; // starting cards for dealer
let isGameInProgress = false; 
let shuffledDeck;
let usedCards =[];

/*----- cached elements  -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');
const playAgainButton = document.getElementById('again');
const betButton = document.getElementById('bet');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');

/*----- event listeners -----*/
playAgainButton.addEventListener('click', restartGame);
betButton.addEventListener('click', bet);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);

/*----- deck from css library */
function getNewShuffledDeck() {
  const tempDeck = [...masterDeck];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function renderNewShuffledDeck() {
  shuffledDeck = getNewShuffledDeck();
  renderDeckInContainer(shuffledDeck, shuffledContainer);
}

function renderDeckInContainer(deck, container, numCards) {
  container.innerHTML = '';
  let cardsHtml = '';
  for (let i = 0; i < numCards; i++) {
    if (deck[i]) {
      cardsHtml += `<div class="card ${deck[i].face}"></div>`;
    } else {
      break; 
    }
  }
  container.innerHTML += cardsHtml;
}


function buildMasterDeck() {
  const deck = [];
  suits.forEach(function (suit) {
    ranks.forEach(function (rank) {
      deck.push({
        face: `${suit}${rank}`,
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}


///////


function bet() {
  if (!isGameInProgress) {
    dealCards();
    isGameInProgress = true;
  }
}

function dealCards() {
  // Deal two random cards to the player and dealer
  playerHand.push(shuffledDeck.pop());
  dealerHand.push(shuffledDeck.pop());
  playerHand.push(shuffledDeck.pop());
  dealerHand.push(shuffledDeck.pop());
  
  // Update the UI to display the player and dealer cards
  renderPlayerHand();
  renderDealerHand();
}

function renderPlayerHand() {
  // Display player's cards on the UI
  const playerHandContainer = document.getElementById('player-hand-container');
  renderHand(playerHand, playerHandContainer);
}

function renderDealerHand() {
  // Display dealer's cards on the UI
  const dealerHandContainer = document.getElementById('dealer-hand-container');
  renderHand(dealerHand, dealerHandContainer);
}

function renderHand(hand, container) {
  container.innerHTML = '';
  hand.forEach(function (card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', card.face);
    container.appendChild(cardElement);
  });
}

function restartGame() {
  scores = { player: 0, dealer: 0 };
  decide = undefined;
  winner = undefined;
  playerHand = [];
  dealerHand = [];
  isGameInProgress = false;
  usedCards = [];
  renderNewShuffledDeck();
  // Reset UI elements for player and dealer hands
  const playerHandContainer = document.getElementById('player-hand-container');
  const dealerHandContainer = document.getElementById('dealer-hand-container');
  playerHandContainer.innerHTML = '';
  dealerHandContainer.innerHTML = '';
}

function hit() {
  // Logic for player hitting
}

function stand() {
  // Logic for player standing
}
