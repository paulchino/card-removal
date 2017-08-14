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
            expect(cardTracker.remainingCards.jd).to.equal(-1);
        });
    });

    describe('returnCards', function() {
        var cardTracker = new CardTracker(4),
        returnedCards = cardTracker.returnCards();

        it('Should return remainingCards', function() {
            assert.isObject(returnedCards);
            assert.containsAllKeys(returnedCards, constructDeckArray());
            expect(cardTracker.remainingCards.as).to.equal(4);
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

        it('Should warn of negative card count', function() {
            var spy = sinon.spy(console, 'warn'),
            cardTracker = new CardTracker(2);

            cardTracker.removeCards('as as as');
            assert(spy.calledWith('Warning: Card count below 0'));
            spy.restore();
        });
    });
});
