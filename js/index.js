"use strict";

/* Helper functions --- */
// Repeat
Array.prototype.repeat = function (repeats) {
  // From https://stackoverflow.com/a/50672154/7982963
  return [].concat(...Array.from({ length: repeats }, () => this));
};
// Shuffle
Array.prototype.shuffle = function () {
  // from https://stackoverflow.com/a/6274381/7982963
  for (let i = this.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * i);
    [this[i], this[randomIndex]] = [this[randomIndex], this[i]];
  }
  return this;
};
// Remove All children
Node.prototype.removeAll = function () {
  while (this.firstChild) {
    this.removeChild(this.firstChild);
  }
  return this;
};
// Pad time with zeros
const zeroPadded = (num) => (num < 10 ? `0${num}` : num);

/* Card Class --- */
class Card {
  constructor(id, characterName, src) {
    this.id = id;
    this.characterName = characterName;
    this.src = src;
  }
}

/* ===================================
  Model
  ==================================== */
const model = {
  cards: [
    new Card(1, "Akasaka", "images/akasaka.png"), // id, name and src
    new Card(2, "Armin", "images/armin.png"),
    new Card(3, "Gon", "images/gon.png"),
    new Card(4, "Hisoka", "images/hisoka.png"),
    new Card(5, "Killua", "images/killua.png"),
    new Card(6, "Kite", "images/kite.png"),
    new Card(7, "Kurapica", "images/kurapica.png"),
    new Card(8, "Tanaka", "images/tanaka.png"),
  ],
  selectedId: null,
  firstClick: true,
  matchingResult: "",
  character: "",
  moves: 0,
  time: {
    seconds: 0,
    minutes: 0,
  },
  stars: 3,
};

/* ===================================
  Octopus
  ==================================== */
const octopus = {
  getMovesRecord() {
    return model.moves;
  },
  getTime() {
    return model.time;
  },
  getStarsNum() {
    return model.stars;
  },
  getCards() {
    return model.cards;
  },
  getSelectedId() {
    return model.selectedId;
  },
  setSelectedId(id) {
    model.selectedId = id;
  },
  resetSelectedId() {
    model.selectedId = null;
  },
  incrementMoves() {
    model.moves++;
    movesView.render();
    modalView.render();
  },
  startTimer() {
    timerView.start();
  },
  updateTime(seconds, minutes) {
    model.time.seconds = seconds;
    model.time.minutes = minutes;
    timerView.render();
    modalView.render();
  },
  stopTimer() {
    timerView.stop();
  },
  isFirstClick() {
    return model.firstClick;
  },
  falseFirstClick() {
    model.firstClick = false;
  },
  determineStarsNum() {
    starsView.determineNum(model.moves);
  },
  updateStars(num) {
    model.stars = num;
    starsView.render();
  },
  getMatchingResult() {
    return model.matchingResult;
  },
  updateMatchingResult(str) {
    model.matchingResult = str;
    gameStatus.render();
  },
  getCharacter() {
    return model.character;
  },
  updateCharacter(character) {
    model.character = character;
    gameStatus.render();
  },
  openDialog() {
    modalView.openDialog();
  },
  closeDialog() {
    modalView.closeDialog();
  },
  reset(focusedIndex) {
    model.moves = 0;
    model.stars = 3;
    model.matchingResult = "";
    model.character = "";
    // Board
    model.selectedId = null;
    model.firstClick = true;
    boardView.reset();

    // Render
    movesView.render();
    timerView.reset();
    starsView.render();
    window.setTimeout(() => boardView.render(focusedIndex), 300); // Card showing time
    gameStatus.render();
  },
  init() {
    keyboardSupportView.init();
    movesView.init();
    timerView.init();
    starsView.init();
    boardView.init();
    resetButton.init();
    rulesView.init();
    gameStatus.init();
    modalView.init();
  },
};

/* ===================================
  Views
  ==================================== */

/* Keyboard support --- */
const keyboardSupportView = {
  init() {
    this.startButton = $(".keyboard-support button");
    // this.startButton = document.querySelector(".keyboard-support button");
    this.startButton.click(function focusFirstCard() {
      const firstCard = $(".card button")[0];
      firstCard.focus();
    });
  },
};

/* Rules --- */
const rulesView = {
  init() {
    this.viewRulesButton = $("#rules-section button");
    this.rules = $("#rules");
    this.viewRulesButton.click(() => {
      if (this.viewRulesButton.attr("aria-pressed") === "false") {
        this.expand();
      } else {
        this.collapse();
      }
    });
  },
  expand() {
    rules.style.cssText = "overflow: auto; height: auto;";

    this.viewRulesButton.attr("aria-pressed", "true");
    this.viewRulesButton.attr("aria-expanded", "true");
  },
  collapse() {
    rules.style.cssText = "overflow: hidden; height: 0;";

    this.viewRulesButton.attr("aria-pressed", "false");
    this.viewRulesButton.attr("aria-expanded", "false");
  },
};

/* Moves ---*/
const movesView = {
  init() {
    this.movesRecord = document.querySelector(".moves-record");
    this.render();
  },
  render() {
    const moves = octopus.getMovesRecord();
    this.movesRecord.textContent =
      moves === 1 ? moves + " move" : moves + " moves";
  },
};

/* Timer --- */
const timerView = {
  init() {
    this.timer = document.querySelector(".timer");
    this.render();
  },
  start() {
    let seconds = 0,
      minutes = 0;
    const incrementSecond = () => {
      if (seconds + 1 === 60) {
        minutes++;
        seconds = 0;
      } else {
        seconds++;
      }
      octopus.updateTime(seconds, minutes);
    };
    this.interval = window.setInterval(incrementSecond, 1000);
  },
  stop() {
    clearInterval(this.interval);
  },
  reset() {
    this.stop();
    const seconds = 0,
      minutes = 0;
    octopus.updateTime(seconds, minutes);
  },
  render() {
    const { seconds, minutes } = octopus.getTime();
    const timeString = `${zeroPadded(seconds)}:${zeroPadded(minutes)}`;
    this.timer.textContent = timeString;
  },
};

/* Stars --- */
const starsView = {
  init() {
    this.starsLists = Array.from(document.querySelectorAll(".stars-list"));
    this.render();
  },
  determineNum(moves) {
    if (moves > 12) {
      const starsNum = moves > 16 ? 1 : moves > 20 ? 0 : 2;
      octopus.updateStars(starsNum);
    }
  },
  render() {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < octopus.getStarsNum(); i++) {
      const listItem = document.createElement("li");
      listItem.classList.add("star");
      listItem.innerHTML = '<span role="img" aria-label="Star">★</span>';
      fragment.appendChild(listItem);
    }
    this.starsLists.forEach((starsList) => {
      starsList.innerHTML = "";
      starsList.appendChild(fragment.cloneNode(true));
    });
  },
};

/* Reset button --- */
const resetButton = {
  init() {
    this.button = document.querySelector(".reset");
    this.button.addEventListener("click", () => {
      this.reset();
    });
  },
  reset() {
    octopus.reset();
  },
};

/* Board --- */
const boardView = {
  init() {
    this.board = document.querySelector(".board");
    this.adjustBoardHeight();

    this.rows = Array.from(document.querySelectorAll(".row"));

    this.clickEnabled = true;
    this.board.addEventListener("click", (event) => {
      if (!this.clickEnabled) return;

      const target = event.target;
      if (target.nodeName !== "UL") {
        // Card is clicked
        if (octopus.isFirstClick()) {
          octopus.startTimer();
          octopus.falseFirstClick();
        }

        const card =
          target.nodeName === "LI"
            ? target.querySelector("button")
            : target.nodeName === "BUTTON"
            ? target
            : target.parentNode; // target: <div class="front"> inside button
        const currentId = card.getAttribute("data-id");
        const firstId = octopus.getSelectedId();

        // Making sure player cant click the same card
        const sameCard = card.getAttribute("aria-selected") === "true";
        if (sameCard) return;

        octopus.updateCharacter(card.getAttribute("data-name"));
        this.trueAriaSelectedAttr(card);

        if (firstId === null) {
          // No cards previously selected
          octopus.setSelectedId(currentId);
        } else {
          // A card is already clicked, so let's test with the new card
          octopus.incrementMoves();
          octopus.determineStarsNum();
          this.matchAndRespond(firstId, currentId);
        }
      }
    });

    this.interactiveKeys = {
      35: "end",
      36: "home",
      37: "left",
      38: "up",
      39: "right",
      40: "down",
    };

    this.render();
  },
  adjustBoardHeight() {
    this.board.style.height = this.board.offsetWidth + "px";
    window.addEventListener("resize", () => {
      this.board.style.height = this.board.offsetWidth + "px";
    });
  },
  matchAndRespond(firstId, secondId) {
    const visualFeedbackTime = 1100;
    this.clickEnabled = false;
    window.setTimeout(() => (this.clickEnabled = true), visualFeedbackTime);
    if (firstId === secondId) {
      const matchedCards = this.cards.filter(
        (card) => card.getAttribute("data-id") === firstId
      );
      octopus.updateMatchingResult("match");
      this.flashMatching(matchedCards); // Visiual feedback first
      this.trueDataMatchedAttr(matchedCards);
      this.checkWin();
    } else {
      const unmatchedCards = this.cards.filter(
        (card) =>
          card.getAttribute("aria-selected") === "true" &&
          card.getAttribute("data-matched") === "false"
      );
      octopus.updateMatchingResult("different");
      this.flashUnmatching(unmatchedCards); // Visiual feedback first
      window.setTimeout(() => {
        this.falseAriaSelectedAttr(unmatchedCards);
      }, visualFeedbackTime);
    }
    octopus.resetSelectedId();
  },
  flashMatching(matchedCards) {
    const cardShowingTime = 300;
    const flashTime = 200;
    // Keyframe alternative
    window.setTimeout(() => {
      this.backgroundGreen(matchedCards);
      window.setTimeout(() => {
        this.backgroundWhite(matchedCards);
        window.setTimeout(() => {
          this.backgroundGreen(matchedCards);
        }, flashTime);
      }, flashTime);
    }, cardShowingTime);
  },
  flashUnmatching(unmatchedCards) {
    const cardShowingTime = 300;
    const flashTime = 200;
    // Keyframe alternative
    window.setTimeout(() => {
      this.backgroundRed(unmatchedCards);
      window.setTimeout(() => {
        this.backgroundWhite(unmatchedCards);
        window.setTimeout(() => {
          this.backgroundRed(unmatchedCards);
          window.setTimeout(() => {
            this.backgroundWhite(unmatchedCards);
          }, flashTime);
        }, flashTime);
      }, flashTime);
    }, cardShowingTime);
  },
  backgroundRed(cards) {
    cards.forEach((card) => (card.style.backgroundColor = "#FCB8B8"));
  },
  backgroundGreen(cards) {
    cards.forEach((card) => (card.style.backgroundColor = "#B8FCC0"));
  },
  backgroundWhite(cards) {
    cards.forEach((card) => (card.style.backgroundColor = "white"));
  },
  trueDataMatchedAttr(matchedCards) {
    matchedCards.forEach((card) => card.setAttribute("data-matched", "true"));
  },
  trueAriaSelectedAttr(card) {
    card.setAttribute("aria-selected", "true");
  },
  falseAriaSelectedAttr(unmatchedCards) {
    unmatchedCards.forEach((card) => card.setAttribute("aria-selected", false));
  },
  checkWin() {
    const allMatched = this.cards.every(
      (card) => card.getAttribute("data-matched") === "true"
    );
    if (allMatched) {
      octopus.updateMatchingResult("Done");
      octopus.stopTimer();
      setTimeout(() => {
        octopus.openDialog();
      }, 300); // Card opening time
    }
  },
  reset() {
    this.falseAriaSelectedAttr(this.cards);
  },
  handleInput(card, cardOrder, direction) {
    let activeCard,
      previousCard = card;
    switch (direction) {
      case "right":
        if (cardOrder !== 15) {
          // Last card
          activeCard = this.cards[cardOrder + 1];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case "left":
        if (cardOrder !== 0) {
          // First card
          activeCard = this.cards[cardOrder - 1];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case "down":
        if (cardOrder >= 12 && cardOrder <= 14) {
          // Last row
          activeCard = this.cards[cardOrder - 11];
          this.activateCard(previousCard, activeCard);
        } else if (cardOrder !== 15) {
          activeCard = this.cards[cardOrder + 4];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case "up":
        if (cardOrder >= 1 && cardOrder <= 3) {
          // First row
          activeCard = this.cards[cardOrder + 11];
          this.activateCard(previousCard, activeCard);
        } else if (cardOrder !== 0) {
          activeCard = this.cards[cardOrder - 4];
          this.activateCard(previousCard, activeCard);
        }
        break;
      case "home":
        if (cardOrder <= 3) {
          activeCard = this.cards[0];
        } else if (cardOrder <= 7) {
          activeCard = this.cards[4];
        } else if (cardOrder <= 11) {
          activeCard = this.cards[8];
        } else {
          activeCard = this.cards[12];
        }
        this.activateCard(previousCard, activeCard);
        break;
      case "end":
        if (cardOrder >= 12) {
          activeCard = this.cards[15];
        } else if (cardOrder >= 8) {
          activeCard = this.cards[11];
        } else if (cardOrder >= 4) {
          activeCard = this.cards[7];
        } else {
          activeCard = this.cards[3];
        }
        this.activateCard(previousCard, activeCard);
        break;
    }
  },
  activateCard(oldCard, newCard) {
    oldCard.blur();
    oldCard.setAttribute("tabindex", "-1"); // Remove from tab sequence
    newCard.focus();
    newCard.setAttribute("tabindex", "0"); //Set in the tab sequence
  },
  render(focusedIndex) {
    this.rows.forEach((row) => row.querySelector("ul").removeAll());
    const fragment = document.createDocumentFragment();
    let rowIndex = 0;
    const cards = octopus.getCards().repeat(2).shuffle();
    cards.forEach((card, index) => {
      const listItem = document.createElement("li");
      listItem.classList.add("card");
      if (index === 0) {
        // Only the first card will be in the tab sequence
        listItem.innerHTML = `<button type="button" data-matched="false" role="gridcell" aria-selected="false" aria-label="card ${
          index + 1
        }" data-id="${card.id}" data-num="${index}" data-name="${
          card.characterName
        }">
          <img src="${card.src}" alt="Anime Character" class="back">
          <div class="front"></div>
        </button>`;
      } else {
        // tabindex="-1"
        listItem.innerHTML = `<button type="button" data-matched="false" role="gridcell" aria-selected="false" aria-label="card ${
          index + 1
        }" data-id="${card.id}" tabindex="-1" data-num="${index}" data-name="${
          card.characterName
        }">
          <img src="${card.src}" alt="Anime Character" class="back">
          <div class="front"></div>
        </button>`;
      }
      fragment.appendChild(listItem);
      if (fragment.children.length === 4) {
        // Row
        this.rows[rowIndex].querySelector("ul").appendChild(fragment);
        rowIndex++;
        fragment.removeAll();
      }
    });
    this.cards = Array.from(document.querySelectorAll("[data-id]"));
    if (focusedIndex) {
      this.cards[focusedIndex].focus();
    }

    // Managing Focus - Keyboard support
    this.cards.forEach((card) => {
      card.addEventListener("keydown", (event) => {
        if (event.keyCode === 35 || event.keyCode === 36)
          event.preventDefault(); // home || end
        const cardOrder = card.getAttribute("data-num");
        this.handleInput(
          card,
          Number(cardOrder),
          this.interactiveKeys[event.keyCode]
        );
      });
    });
  },
};

/* Game status --- */
const gameStatus = {
  init() {
    this.matchingResult = document.querySelector("#matching-result");
    this.character = document.querySelector("#character");
  },
  render() {
    this.matchingResult.textContent = octopus.getMatchingResult();
    this.character.textContent = "Character name: " + octopus.getCharacter();
  },
};

/* Modal Window --- */
const modalView = {
  init() {
    this.modalContainer = document.querySelector("#modal-container");
    this.modal = document.querySelector("#result-modal");
    this.movesAndTime = document.querySelector("#moves-time");
    this.button = document.querySelector("#play-again");
    // Event listeners
    this.button.addEventListener("click", () => {
      octopus.closeDialog();
      octopus.reset(this.focusedElementBeforeModal.getAttribute("data-num")); // Pass a refernce to the last focused element so it's focused again after resetting
    });
    this.button.addEventListener("keydown", (event) => {
      if (event.keyCode === 9) event.preventDefault(); // tab: Focus trap
      else if (event.keyCode === 27) this.closeDialog(); // esc: close
    });
    this.modalContainer.addEventListener("click", (event) => {
      if (event.target === this.modalContainer) {
        this.closeDialog();
      }
    });

    this.render();
  },
  generateResultStr(moves, seconds, minutes) {
    let resultStr;
    if (minutes > 0) {
      resultStr = `${moves} ${moves === 1 ? "move" : "moves"} in ${minutes} ${
        minutes === 1 ? "minute" : "minutes"
      }`;
      if (seconds > 0) {
        resultStr += ` and ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
      }
    } else {
      // minutes = 0
      resultStr = `${moves} ${moves === 1 ? "move" : "moves"} in ${seconds} ${
        seconds === 1 ? "second" : "seconds"
      }`;
    }
    return resultStr;
  },
  openDialog() {
    this.focusedElementBeforeModal = document.activeElement; // Reference to the last focused element
    this.modalContainer.setAttribute("data-visible", "true");
    this.modal.open = true;
    this.button.focus();
  },
  closeDialog() {
    this.modalContainer.setAttribute("data-visible", "false");
  },
  render() {
    const { seconds, minutes } = octopus.getTime();
    const moves = octopus.getMovesRecord();
    const resultStr = this.generateResultStr(moves, seconds, minutes);
    this.movesAndTime.textContent = resultStr;
  },
};

octopus.init();

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.onload = function () {
    navigator.serviceWorker
      .register("./sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  };
}
