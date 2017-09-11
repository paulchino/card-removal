# card-removal

[![Travis](https://img.shields.io/travis/paulchino/card-removal.svg?style=flat-square)](https://img.shields.io/travis/paulchino/card-removal.svg?style=flat-square)
[![Codecov](https://img.shields.io/codecov/c/github/paulchino/card-removal.svg?style=flat-square)](https://codecov.io/github/paulchino/card-removal)
[![version](https://img.shields.io/npm/v/card-tracker.svg?style=flat-square)](https://www.npmjs.com/package/card-tracker)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](http://opensource.org/licenses/MIT)

# What it does
card-tracker is a dependency free library which keeps running track of the remaining cards left in the deck and the current blackjack card count. Cards can either be added or removed to your tracker.

# Install
npm install card-tracker

# Usage
```js
var CardTracker = require(‘card-tracker’);
var cardTracker = new CardTracker(1); // number of card decks

cardTracker.removeCards('as td jc');
cardTracker.decks // 1 - Initial number of decks on initialize
cardTracker.cardCount // -3 as 3 high cards removed
cardTracker.numberOfCardsLeft // 49 (52 - 3)
cardTracker.remainingCards // {'as': 0, 'ad': 1, ... 'ts': 1, 'td': 0, ... 'jc': 0}
cardTracker.trueCardCount // -3 / (49 / 52) = 3.18

cardTracker.addCards('td td td')
cardTracker.numberOfCardsLeft // 52
cardTracker.reaminingCards // {... 'td': 3, ...}
cardTracker.cardCount // 0 since adding high card increases count

cardTracker.updateCardValues({
  '2': -100;
});

cardTracker.removeCards('2c');
cardTracker.cardCount // -100;
```

# Notes
* TODO


