const expect = require('chai').expect,
    assert = require('chai').assert,
    sinon = require('sinon'),
    CardTracker = require('../src/index'),
    cardVals = [
        'a', 'k', 'q', 'j', 't', '9', '8',
        '7', '6', '5', '4', '3', '2'
    ],
    suits = ['s', 'd', 'h', 'c'];

function constructDeckArray() {
    var deckArr = [];

    cardVals.forEach(function(val) {
        suits.forEach(function(suit) {
            deckArr.push(val + suit);
        });
    });
    return deckArr;
}

describe('cardTracker', function() {
    it('Should be a function', function() {
        expect(CardTracker).to.be.a('function');
    });

    describe('classInstance', function() {
        var cardTracker = new CardTracker(1);

        it('Should have deck property with value of 1', function() {
            expect(cardTracker).to.have.property('decks').and.equal(1);
        });

        it('Should have correct cardCount, trueCardCount, and numberOfCardsLeft', function() {
            expect(cardTracker.cardCount).to.equal(0);
            expect(cardTracker.trueCardCount).to.equal(0);
            expect(cardTracker.numberOfCardsLeft).to.equal(52);
            assert.containsAllKeys(cardTracker.cardValues, cardVals);
        });

        it('Should have a remainingCards attribute with 52 keys', function() {
            expect(cardTracker).to.have.property('remainingCards').and.be.a('object');
            assert.equal(Object.keys(cardTracker.remainingCards).length, 52);
        });

        it('Should have only valid keys in remainingCards attribute', function() {
            assert.containsAllKeys(cardTracker.remainingCards, constructDeckArray());
        });

        it('Should have remainingCard with all values being 1', function() {
            var allValuesEqualOne = true;

            for (k in cardTracker.remainingCard) {
                if (cardTracker.remainingCard[k] !== 1) {
                    allValuesEqualOne = false;
                }
            }
            expect(allValuesEqualOne).to.be.true;
        });
    });
});

describe('cardMethods', function() {
    describe('addCards', function() {
        var cardTracker = new CardTracker(5);
        cardTracker.addCards('as qh as');
        it('Should have as and qh values updated', function() {
            assert.containsAllKeys(cardTracker.remainingCards, constructDeckArray());
            expect(cardTracker.remainingCards.as).to.equal(7);
            expect(cardTracker.remainingCards.qh).to.equal(6);
        });
    });

    describe('removeCards', function() {
        var cardTracker = new CardTracker(3);
        cardTracker.removeCards('fake qc ts ts jd jd foo jd jd');
        it('Should have qc, ts, and jd values updated', function() {
            assert.containsAllKeys(cardTracker.remainingCards, constructDeckArray());
            expect(cardTracker.remainingCards.qc).to.equal(2);
            expect(cardTracker.remainingCards.ts).to.equal(1);
            expect(cardTracker.remainingCards.jd).to.equal(0);
        });
    });

    describe('updateCardValues', function() {
        var cardTracker = new CardTracker(2);
        cardTracker.updateCardValues({
            'a': 4,
            't': 3,
            'q': 'foo'
        });

        it('Should update a and t cardValues', function() {
            expect(cardTracker.cardValues.a).to.equal(4);
            expect(cardTracker.cardValues.t).to.equal(3);
            expect(cardTracker.cardValues.q).to.equal(-1);
        });
    });
});

describe('cardCounter', function() {
    it('Should have a count of -5', function() {
        var cardTracker = new CardTracker(5);
        cardTracker.removeCards('as ah kd qs tc 9c 8s');
        expect(cardTracker.cardCount).to.equal(-5);
    });

    it('Should have correct count after updateCardValues', function() {
        var cardTracker = new CardTracker(5);
        cardTracker.removeCards('as qs tc');
        expect(cardTracker.cardCount).to.equal(-3);

        cardTracker.updateCardValues({'2': -8});
        // -3 - 16 = -19
        cardTracker.removeCards('2c 2d');
        expect(cardTracker.cardCount).to.equal(-19);

        // -19 + 8 + 0
        cardTracker.addCards('2s 8c')
        expect(cardTracker.cardCount).to.equal(-11);
    });

    it('Should properly update numberOfCardsLeft', function() {
        var cardTracker = new CardTracker(3);
        expect(cardTracker.numberOfCardsLeft).to.equal(156);

        // 8 cards removed, 4th kd is ignored as there are only three
        cardTracker.removeCards('as ah kd qs tc 9c 88 kd kd kd');
        expect(cardTracker.numberOfCardsLeft).to.equal(148);

        // 3 cards added
        cardTracker.addCards('2d 4t 9d tc')
        expect(cardTracker.numberOfCardsLeft).to.equal(151);
    });

    it('Should properly update trueCardCount', function() {
        var cardTracker = new CardTracker(3);

        cardTracker.removeCards('as ad tc');
        expect(cardTracker.cardCount).to.equal(-3);
        expect(cardTracker.numberOfCardsLeft).to.equal(153);
        // count = -3, numberOfCardsLeft = 153, decksRemaining = 153 / 52 = 2.94
        // trueCardCount = -3 / 2.94 = 1.02
        expect(cardTracker.trueCardCount).to.equal(-1.02);

        cardTracker.addCards('8c ad ad foo');
        expect(cardTracker.cardCount).to.equal(-1);
        expect(cardTracker.numberOfCardsLeft).to.equal(156);
        // decksRemaining = 156 / 52 = 3
        // trueCardCount = -1 / 3 = -0.33
        expect(cardTracker.trueCardCount).to.equal(-0.33);
    });


    it('Should properly update trueCardCount after updateCardValue', function() {
        var cardTracker = new CardTracker(3);

        cardTracker.removeCards('as ad tc');
        // count = -3, numberOfCardsLeft = 153, decksRemaining = 153 / 52 = 2.94
        // trueCardCount = -3 / 2.94 = 1.02
        cardTracker.updateCardValues({'8': -100});
        cardTracker.removeCards('8d');
        expect(cardTracker.cardCount).to.equal(-103);
        expect(cardTracker.numberOfCardsLeft).to.equal(152);
        // decksRemaining = 152 / 52 = 2.9231
        // trueCardCount = -103 / 2.9231 =
        expect(cardTracker.trueCardCount).to.equal(-35.24);
    });
});

describe('validationErrors', function() {
    it('Will only accept numbers for deck constructor', function() {
        assert.throws(function () { new CardTracker('foo') });
    });

    it('Cards should only be strings', function() {
        assert.throws(function() {
            var cardTracker = new CardTracker(4);
            cardTracker.addCards(['foo']);
        });
    });

    it('Should warn of invalid cards', function() {
        var spy = sinon.spy(console, 'warn'),
        cardTracker = new CardTracker(2);

        cardTracker.removeCards('ab as foo');
        assert(spy.calledWith('Invalid card: ab'));
        assert(spy.calledWith('Invalid card: foo'));
        spy.restore();
    });

    it('Should warn of zero card count', function() {
        var spy = sinon.spy(console, 'warn'),
        cardTracker = new CardTracker(2);

        cardTracker.removeCards('as as as');
        assert(spy.calledWith('Warning: Card cound cannot be less than 0'));
        spy.restore();
    });

    it('Should warn of invalid argument for updateCardValues', function() {
        var spy = sinon.spy(console, 'warn'),
        cardTracker = new CardTracker(2);

        cardTracker.updateCardValues(['as', 1]);
        assert(spy.calledWith('Warning: Pass an object'));
        spy.restore();
    });
});
