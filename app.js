// Card and Deck setup
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = [
  { name: '2', value: 2 }, { name: '3', value: 3 }, { name: '4', value: 4 },
  { name: '5', value: 5 }, { name: '6', value: 6 }, { name: '7', value: 7 },
  { name: '8', value: 8 }, { name: '9', value: 9 }, { name: '10', value: 10 },
  { name: 'J', value: 11 }, { name: 'Q', value: 12 }, { name: 'K', value: 13 }, { name: 'A', value: 14 }
];

function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({ suit, rank: rank.name, value: rank.value });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const readline = require('readline');

function waitForEnter() {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Press Enter to continue...', () => {
      rl.close();
      resolve();
    });
  });
}

// Color helpers
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgWhite: "\x1b[47m",
  black: "\x1b[30m"
};

function colorText(text, color) {
  return color + text + colors.reset;
}

// ASCII card rendering
function getCardColor(suit) {
  if (suit === 'Hearts' || suit === 'Diamonds') return colors.red;
  return colors.black;
}

function getSuitSymbol(suit) {
  switch (suit) {
    case 'Hearts': return '♥';
    case 'Diamonds': return '♦';
    case 'Clubs': return '♣';
    case 'Spades': return '♠';
    default: return '?';
  }
}

function renderCard(card) {
  const suitSymbol = getSuitSymbol(card.suit);
  const rankLeft = card.rank.padEnd(2, ' ');
  const rankRight = card.rank.padStart(2, ' ');
  const color = getCardColor(card.suit);
  const bg = colors.bgWhite;
  // Use '│' for vertical borders
  return [
    bg + color + "┌───────┐" + colors.reset,
    bg + color + `│${rankLeft}     │` + colors.reset,
    bg + color + "│       │" + colors.reset,
    bg + color + `│   ${suitSymbol}   │` + colors.reset,
    bg + color + "│       │" + colors.reset,
    bg + color + `│     ${rankRight}│` + colors.reset,
    bg + color + "└───────┘" + colors.reset
  ];
}

function renderCardsSideBySide(card1, card2) {
  const lines1 = renderCard(card1);
  const lines2 = renderCard(card2);
  let output = '';
  for (let i = 0; i < lines1.length; i++) {
    output += lines1[i] + '  ' + lines2[i] + '\n';
  }
  return output;
}

// Game logic
async function playGame() {
  console.clear(); // Clear console at start
  console.log(colorText('Welcome to the 2-Player Card Game!', colors.cyan));
  console.log(colorText('Each player is dealt a card. The highest card wins the hand and gets both cards.', colors.yellow));
  console.log(colorText('The process repeats until all 52 cards are dealt.', colors.yellow));
  console.log(colorText('The player with the highest score at the end wins the game.', colors.yellow));
  console.log(colorText('Press Enter after each hand to continue.\n', colors.magenta));
  await waitForEnter();

  let deck = createDeck();
  deck = shuffle(deck);

  let player1Score = 0;
  let player2Score = 0;

  for (let i = 0; i < deck.length; i += 2) {
    console.clear(); // Clear console before each hand
    const card1 = deck[i];
    const card2 = deck[i + 1];

    console.log(colorText(`Hand ${i / 2 + 1}:`, colors.bright));
    // Show ASCII cards side by side
    console.log(renderCardsSideBySide(card1, card2));
    console.log(colorText(`Player 1: ${card1.rank} of ${card1.suit}`, colors.blue));
    console.log(colorText(`Player 2: ${card2.rank} of ${card2.suit}`, colors.green));

    if (card1.value > card2.value) {
      player1Score += 2;
      console.log(colorText('Player 1 wins the hand.\n', colors.blue));
    } else if (card2.value > card1.value) {
      player2Score += 2;
      console.log(colorText('Player 2 wins the hand.\n', colors.green));
    } else {
      // Tie: each player gets 1 point
      player1Score += 1;
      player2Score += 1;
      console.log(colorText('Tie! Both players get 1 point.\n', colors.yellow));
    }

    await waitForEnter();
  }

  console.clear(); // Clear console before showing final results
  console.log(colorText('Game Over!', colors.magenta));
  console.log(colorText(`Player 1 Score: ${player1Score}`, colors.blue));
  console.log(colorText(`Player 2 Score: ${player2Score}`, colors.green));

  if (player1Score > player2Score) {
    console.log(colorText('Player 1 wins the game!', colors.blue));
  } else if (player2Score > player1Score) {
    console.log(colorText('Player 2 wins the game!', colors.green));
  } else {
    console.log(colorText('The game is a tie!', colors.yellow));
  }
}

playGame();
