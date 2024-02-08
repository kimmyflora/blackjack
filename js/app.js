// const 
const suits = ['s', 'c', 'd', 'h'];
const ranks = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const masterDeck = buildMasterDeck();

/*----- state variables -----*/
let decide; // player & dealer hit/stand 
let winner; // who won that round 
let playerHand = []; // starting cards for player
let dealerHand = []; // starting cards for dealer
let isGameInProgress = false;
let shuffledDeck;
let usedCards = [];
let playerFunds = 100; // Starting funds for the player
let betAmount = 10; // Default bet amount

/*----- cached elements  -----*/
const shuffledContainer = document.getElementById('shuffled-deck-container');
const playAgainButton = document.getElementById('again');
const betButton = document.getElementById('bet');
const hitButton = document.getElementById('hit');
const standButton = document.getElementById('stand');
const playerHandContainer = document.getElementById('player-hand-container');
const dealerHandContainer = document.getElementById('dealer-hand-container');
const resultElement = document.getElementById('resultElement');
const newGameButton = document.getElementById('newGameButton');
const betDisplay = document.getElementById('bet-display');
const fundsDisplay = document.getElementById('funds-display');

/*----- event listeners -----*/
betButton.addEventListener('click', bet);
hitButton.addEventListener('click', hit);
standButton.addEventListener('click', stand);
newGameButton.addEventListener('click', restartGame)

// deck from css library 
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

// Display bet amount and funds on display on mdn 
function funds() {
  betDisplay.textContent = `Bet Amount: ${betAmount}`;
  fundsDisplay.textContent = `Player Funds: ${playerFunds}`;
}

// start the game once clicked on bet
function bet() {
  if (!isGameInProgress) {
    betAmount = 10; // Set the bet amount to $10
    playerFunds -= betAmount;
    funds(); //display funds amount and bet per round 
    renderNewShuffledDeck(); //start the deck
    dealCards(); // Deal cards 
    isGameInProgress = true; // Set game in progress f
    resultElement.textContent = ''; // Clear any previous message
  }
}

// tell what the starting value is for dealer and player 
function startValue(hand) {
  return hand.reduce((sum, card) => sum + card.value, 0);
}
// display what the card value is mdn
function displayHandSum(hand, sumContainer, label) {
  const handSum = startValue(hand);
  sumContainer.textContent = `${label} Sum: ${handSum}`;
  sumContainer.style.fontSize = '50px';
}

function playerHandSum() {
  displayHandSum(playerHand, document.getElementById('player-hand-sum'), 'Player');
}

function dealerHandSum() {
  displayHandSum(dealerHand, document.getElementById('dealer-hand-sum'), 'Dealer');
}

// Deal two random cards to the player and dealer
function dealCards() {
  playerHand.push(shuffledDeck.pop());
  dealerHand.push(shuffledDeck.pop());
  playerHand.push(shuffledDeck.pop());
  dealerHand.push(shuffledDeck.pop());

  // display the player and dealer cards
  renderPlayerHand();
  renderDealerHand();
  playerHandSum();
  dealerHandSum();
}

// Display player's cards 
function renderPlayerHand() {
  renderHand(playerHand, playerHandContainer);
  const playerText = document.createTextNode('Player');
  playerHandContainer.appendChild(playerText);
}

// Display dealer's cards 
function renderDealerHand() {
  renderHand(dealerHand, dealerHandContainer);
  const dealerText = document.createTextNode('Dealer');
  dealerHandContainer.appendChild(dealerText);
}

// from the deck of cards
function renderHand(hand, container) {
  container.innerHTML = '';
  hand.forEach(function (card) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card', card.face);
    // Add a class to ensure the card is displayed face-up
    cardElement.classList.add('face-up');
    container.appendChild(cardElement);
  });
}

//checking for bj once beginning cards have been deal
function checkBlackjack() {
  if (playerHand.length === 2 && startValue(playerHand) === 21) {
    endGame('Player got Blackjack!');
    return;
  }
  if (dealerHand.length === 2 && startValue(dealerHand) === 21) {
    endGame('Dealer got Blackjack!');
    return;
  }
}

//check for bust
function checkBust() {
  const playerSum = startValue(playerHand);
  const dealerSum = startValue(dealerHand);

  if (playerSum > 21) {
    endGame('Player bust');
    return true;
  } else if (dealerSum > 21) {
    endGame('Dealer bust!');
    return true;
  }

  return false;
}

//check for winner 
function checkWinner() {
  if (checkBust()) {
    // Already handled in checkBust() function
    return;
  }

  if (startValue(playerHand) > startValue(dealerHand)) {
    endGame('You win!');
    // Increment player funds by 10 when player wins
    playerFunds += 10;
    funds(); // Update funds display
  } else if (startValue(playerHand) < startValue(dealerHand)) {
    endGame('You lose!');
  } else {
    endGame('It\'s a tie!');
  }
}


//end game 
function endGame(message) {
  isGameInProgress = false;
  resultElement.textContent = message;
  resultElement.style.fontSize = '100px'
}

// function for when clicked on new game / play again
function restartGame() {
  decide = undefined;
  winner = undefined;
  playerHand = [];
  dealerHand = [];
  isGameInProgress = false;
  usedCards = [];
  renderNewShuffledDeck();

  // Enable all other buttons
  betButton.disabled = false;
  hitButton.disabled = false;
  standButton.disabled = false;

  // Clear the starting value message and cards from the current game
  document.getElementById('player-hand-sum').textContent = '';
  document.getElementById('dealer-hand-sum').textContent = '';
  document.getElementById('resultElement').textContent = '';
  playerHandContainer.innerHTML = '';
  dealerHandContainer.innerHTML = '';

  // Change the button text and disable it until bet is clicked
  newGameButton.textContent = 'New Game';
  newGameButton.disabled = false;
}

// player hitting
function hit() {
  if (!shuffledDeck || shuffledDeck.length === 0) {
    console.log("Error: Deck is empty or undefined");
    return;
  }

  playerHand.push(shuffledDeck.pop());
  renderPlayerHand();
  playerHandSum();

  if (startValue(playerHand) > 21) {
    endGame('Player Bust! Over 21!!');
  } else if (startValue(playerHand) === 21) {
    endGame('Player reached 21!');
  }

}

//when player click stand 
function stand() {
  while (startValue(dealerHand) < 17) {
    dealerHand.push(shuffledDeck.pop());
  }
  dealerHit(); // Call dealerHit() function
  renderDealerHand();
  checkWinner();
  hitButton.disabled = true; // Disable hit button after standing
  betButton.disabled = true; //disable bet after standing 
}

//when dealer hit
function dealerHit() {
  while (startValue(dealerHand) < 17) {
    dealerHand.push(shuffledDeck.pop());
    renderDealerHand();
  }
  dealerHandSum(); // Update the sum after all cards are added

  if (startValue(dealerHand) > 21) {
    endGame('Dealer busts! You win!');
    // Increment player funds by 10 when player wins
    playerFunds += 10;
    funds(); // Update funds display
  } else if (startValue(dealerHand) === 21) {
    endGame('Dealer reached 21!');
  } else {
    checkWinner();
  }
}
