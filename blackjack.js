let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true;

const flip = new Audio("./flip.mp3");
const win = new Audio("./win.mp3");
const lose = new Audio("./lose.mp3");
const tie = new Audio("./tie.mp3");

//Loads game on new window

window.onload = function() {
  buildDeck();
  shuffleDeck();
  startGame();
}

//Creates deck of cards with value and type

function buildDeck() {
  let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  let types = ["C", "D", "H", "S"];
  deck = [];

  for (let i = 0; i < types.length; i++) { //Builds deck of 52 cards
    for (let j = 0; j < values.length; j++) {
      deck.push(values[j] + "-" + types[i]);
    }
  }
}

//Randomizes order of deck

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length); // (0-1) * 52
    let temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
}

function startGame() {
  hidden = deck.pop(); //Gets a random card and make it hidden
  dealerSum += getValue(hidden);
  dealerAceCount += checkAce(hidden);

  //Creates initial dealer card
  
  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  dealerSum += getValue(card);
  dealerAceCount += checkAce(card);
  document.getElementById("dealer-cards").append(cardImg);

  //Creates two cards for player
  
  for (let i = 0; i < 2; i++) {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
  }

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);

}

function hit() {
  if (!canHit) {
    return;
  }

  //Adds a new card on hit

  let cardImg = document.createElement("img");
  let card = deck.pop();
  cardImg.src = "./cards/" + card + ".png";
  cardImg.classList.add("card-fly-in");
  yourSum += getValue(card);
  yourAceCount += checkAce(card);
  document.getElementById("your-cards").append(cardImg);
  flip.play();

  if (reduceAcePlayer(yourSum, yourAceCount) > 21) {
    canHit = (yourSum <= 21);
  }
}
  
function stay() {
  dealerSum = reduceAceDealer(dealerSum, dealerAceCount);
  yourSum = reduceAcePlayer(yourSum, yourAceCount);

  canHit = false;
  document.getElementById("hidden").src = "./cards/" + hidden + ".png";

  dealerDraw();
}

function dealerDraw() {
  setTimeout(() => {
    if (dealerSum < 17) {
      let cardImg = document.createElement("img");
      let card = deck.pop();
      cardImg.src = "./cards/" + card + ".png";
      cardImg.classList.add("card-fly-in");
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      document.getElementById("dealer-cards").append(cardImg);
      flip.play();

      if (dealerAceCount > 0 && dealerSum <= 11) {
        dealerSum += 10;
      }

      dealerDraw();
    } else {
      dealerSum = reduceAceDealer(dealerSum, dealerAceCount);

      if (dealerSum > 21 && dealerAceCount > 0) {
        dealerSum = reduceAceDealer(dealerSum, dealerAceCount);
      }

      displayResult();
    }
  }, 500);
}

function displayResult() {
  dealerSum = reduceAceDealer(dealerSum, dealerAceCount);
  yourSum = reduceAcePlayer(yourSum, yourAceCount);

  let message = "";
  let textColor = "";

  if (yourSum > 21) {
    message = "BUST";
    textColor = "#9c0303";
    lose.play();
  }
  else if (dealerSum > 21) {
    message = "YOU WIN!";
    textColor = "#1ca127";
    audioSrc = "./win.mp3";
    win.play();
  }
  else if (yourSum === dealerSum) {
    message = "TIE";
    textColor = "#daaf22";
    audioSrc = "./tie.mp3";
    tie.play();
  }
  else if (yourSum > dealerSum) {
    message = "YOU WIN!";
    textColor = "#1ca127";
    audioSrc = "./win.mp3";
    win.play();
  }
  else if (yourSum < dealerSum) {
    message = "DEALER WIN!";
    textColor = "#9c0303";
    audioSrc = "./lose.mp3";
    lose.play();
  }

  //Displays dealer and player scores
  
  let score1 = document.getElementById("dealer-sum");
  let score2 = document.getElementById("your-sum");
  score1.innerText = dealerSum;
  score2.innerText = yourSum;
  score1.style.color = "yellow";
  score2.style.color = "yellow";

  //Displays result message
  
  let resultMessage = document.getElementById("result-message");
  resultMessage.innerText = message;
  resultMessage.style.color = textColor;
}

function getValue(card) {
  let data = card.split("-");
  let value = data[0];

  if (isNaN(value)) { //Returns 11 if ace, otherwise returns 10 if J, Q, K
    if (value == "A") {
      return 11;
    }
    return 10;
  }

  return parseInt(value);
}

function checkAce(card) {
  if (card[0] == "A") {
    return 1;
  }
  else {
    return 0;
  }
}

//Makes player aces worth from 11 to 1 if it exceeds 21

function reduceAcePlayer(playerSum, playerAceCount) {
  while (playerSum > 21 && playerAceCount > 0) {
    playerSum -= 10;
    playerAceCount -= 1;
  }
  return playerSum;
}

//Makes dealer aces worth from 11 to 1 if it exceeds 21

function reduceAceDealer(dealerSum, dealerAceCount) {
  while (dealerSum > 21 && dealerAceCount > 0) {
    dealerSum -= 10;
    dealerAceCount -= 1;
  }
  return dealerSum;
}

//Restarts the game by refreshing the page

const restartBtn = document.getElementById('restartBtn');
restartBtn.addEventListener('click', () => {
  window.location.reload();
});
