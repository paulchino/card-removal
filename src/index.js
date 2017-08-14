
function CardTracker(decks) {
    this.decks = this.validateConstructor(decks);
    this.remainingCards = {
        'as': 0, 'ad': 0, 'ah': 0, 'ac': 0,
        'ks': 0, 'kd': 0,'kh': 0, 'kc': 0,
        'qs': 0, 'qd': 0, 'qh': 0, 'qc': 0,
        'js': 0, 'jd': 0, 'jh': 0, 'jc': 0,
        'ts': 0, 'td': 0, 'th': 0, 'tc': 0,
        '9s': 0, '9d': 0, '9h': 0, '9c': 0,
        '8s': 0, '8d': 0, '8h': 0, '8c': 0,
        '7s': 0, '7d': 0, '7h': 0, '7c': 0,
        '6s': 0, '6d': 0, '6h': 0, '6c': 0,
        '5s': 0, '5d': 0, '5h': 0, '5c': 0,
        '4s': 0, '4d': 0, '4h': 0, '4c': 0,
        '3s': 0, '3d': 0, '3h': 0, '3c': 0,
        '2s': 0, '2d': 0, '2h': 0, '2c': 0
    };

    this.constructDeck(this.decks);
};

CardTracker.prototype = {
    constructDeck: function(decks) {
        var card;

        for (card in this.remainingCards) {
            this.remainingCards[card] = decks;
        }
    },
    removeCards: function(cards) {
        var cardList = this.validateCards(cards);
        self = this;

        cardList.forEach(function(card) {
            self.remainingCards[card]--;
            if (self.remainingCards[card] < 0) {
                self.constructWarnings('negativeCount', null, true);
            }
        });
    },
    addCards: function(cards) {
        var cardList = this.validateCards(cards);
        self = this;

        cardList.forEach(function(card) {
            self.remainingCards[card]++;
        });
    },
    returnCards: function() {
        return this.remainingCards;
    },
    // Validation
    validateConstructor: function(decks) {
        return typeof decks !== 'number' ? this.constructWarnings('intReq') : Math.round(decks);
    },
    validateCards: function(cards) {
        var cardList,
        self = this,
        invalidCards;

        if (typeof cards !== 'string') {
            this.constructWarnings('updateDeck');
        } else {
            cardList = cards.toLowerCase().trim().split(' ');

            cardList.forEach(function(card) {
                if (!(card in self.remainingCards)) {
                    self.constructWarnings('invalidCard', card, true);
                }
            });
        }

        return cardList;
    },
    constructWarnings: function(map, card, warning) {
        var msg = this.errMsg[map];

        if (card) {
            msg += card;
        }

        if (warning) {
            return console.warn(msg);
        } else {
            throw new SyntaxError(msg);
        }
    },
    errMsg: {
        'intReq': 'Enter an integer to create tracker',
        'updateDeck': 'Enter cards as a space seperated string',
        'invalidCard': 'Invalid card: ',
        'negativeCount': 'Warning: Card count below 0'
    }
}

module.exports = CardTracker;
