# card-removal

[![Travis](https://img.shields.io/travis/paulchino/card-removal.svg?style=flat-square)](https://img.shields.io/travis/paulchino/card-removal.svg?style=flat-square)
[![Codecov](https://img.shields.io/codecov/c/github/paulchino/card-removal.svg?style=flat-square)](https://codecov.io/github/paulchino/card-removal)
[![version](https://img.shields.io/npm/v/card-tracker.svg?style=flat-square)](https://www.npmjs.com/package/card-tracker)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](http://opensource.org/licenses/MIT)

# What it does
card-tracker is a dependency free library which keeps running track of the remaining cards left in the deck and the current blackjack card count. Cards can either be added or removed to your tracker. Both common module and umd compatible for the browser.

# Install
Node:
`npm install card-tracker`

Browser Script:
Go to unpkg.com/card-tracker@version/dist where 'version' is latest released version. 
Insert either the index.umd.js or index.umd.min.js as a script.

# Usage
Initialize
```js
var CardTracker = require(‘card-tracker’);
var cardTracker = new CardTracker(1); // number of card decks
```
Methods:
* removeCards
* addCards
* updateCardValues

```js
/* removeCards and addCards take a space seperated string of cards represented by 
two characters, value and suit
example ten clubs - tc, ace spades - as
*/
cardTracker.removeCards('as td jc');
```
Attributes:
* decks - Initial number of decks used 
* numberOfCardsLeft
* remainingCards
* cardCount - Current card count
* trueCardCount - cardCount / number of decks (where number of decks = `numberOfCardsLeft / 52`
```js
cardTracker.decks // 1
cardTracker.cardCount // -3 as 3 high cards removed
cardTracker.numberOfCardsLeft // 49 (52 - 3)
cardTracker.remainingCards // {'as': 0, 'ad': 1, ... 'ts': 1, 'td': 0, ... 'jc': 0}
cardTracker.trueCardCount // -3 / (49 / 52) = 3.18

cardTracker.addCards('td td td')
cardTracker.numberOfCardsLeft // 52
cardTracker.reamainingCards // {... 'td': 3, ...}
cardTracker.cardCount // 0 since adding high card increases count

cardTracker.updateCardValues({
  '2': -100;
});

cardTracker.removeCards('2c');
cardTracker.cardCount // -100;
```

# Notes
* Atempt to remove a card that has a count of zero will give a warning and be ignored.
* Default card count values are as follows:
  - cards 2 - 6: +1 count
  - 7-9: 0 count
  - 10-a: -1 count
* Using `updateCardValues` to update a card value will not update the existing count, but will use the new value for the count going forward



