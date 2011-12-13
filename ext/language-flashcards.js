// Number of times each card needs to be guessed correctly.
var repetitions = 5;

// Placeholder for flashcards; loaded at the bottom of this file.
var flashcards = {};

var steps = [['info', 'Card info'],
             ['face', 'Side A'],
             ['reverse', 'Side B']];

var clickable = { class: 'click' };

function element(name, content, attributes) {
    var e = $(document.createElement(name));

    if (content) { e.append(content); }
    for (a in attributes) { e.attr(a, attributes[a]); }

    return e;
}

function showList(language, list, cards, step) {
    $('#language-title').show().text(language);
    $('#list-title').show().text(list);
    $('#card-info').empty();
    $('#score').hide();
    $('#card').hide();
    $('#menu ul ul').hide();
    $('#steps').empty();

    $.each(steps, function(i, step) {
        var item = element('li', step[1], clickable);

        item.click(function() {
            showList(language, list, cards, step[0]);
        });

        $('#steps').append(item);
    });

    if (step == 'info') {
        showInfo(cards);
    } else if (step == 'face') {
        startList(cards);
    } else if (step == 'reverse') {
        startList($.map(cards, function(card) {
            return [card.reverse()];
        }));
    }
}

function showInfo(cards) {
    var cardInfo = element('dl');

    $.each(cards, function(i, card) {
        cardInfo.
            append(element('dt', card[0])).
            append(element('dd', card[1]));
    });

    $('#card-info').append(cardInfo);
}

function startList(cards) {
    var cardList = [];

    for (var i = 1; i < repetitions; i++) {
        cardList = cardList.concat(cards);
    }

    $('#score').show();
    $('#card').show();

    nextCard(cardList, []);
}

function flipCard(card) {
    $('#word').text(card);
}

function submitFunction(func) {
    $('#card').off('submit', 'form').on('submit', 'form', func);
}

function updateScore(remainingCards, history) {
    $('#header span').empty();
    $('#remaining').text(remainingCards.length);

    $('#correct').text($.map(history, function(item) {
        return item.correct || null;
    }).length);
}

function nextCard(remainingCards, history) {
    remainingCards.sort(function() { return 0.5 - Math.random(); })

    updateScore(remainingCards, history);
    $('#card>p>span').empty();
    $('#answer span').hide();

    currentCard = remainingCards.shift();

    flipCard(currentCard[0]);

    $('#answer input').val('').focus();

    submitFunction(function() {
        checkAnswer(currentCard, remainingCards, history);
    });
}

function checkAnswer(card, remainingCards, history) {
    var answer = $('#answer input').val().toLowerCase();
    var correct = (answer == card[1]);

    if (correct) {
        $('#answer .success').show();
    } else {
        remainingCards.push(card);
        $('#answer .failure').show();
    }

    history.push({
        challenge: card[0],
        response: card[1],
        answer: answer,
        correct: correct
    });

    $('#correct-answer').text(card[1]);

    submitFunction(function () {
        if (remainingCards.length == 0) {
            showCompletion(remainingCards, history);
        } else {
            nextCard(remainingCards, history);
        }
    });
}

function showCompletion(remainingCards, history) {
    updateScore(remainingCards, history);
    $('#card>p>span').empty();
    $('#answer span').hide();
    $('#word').text('All done!');
}

function showMenu() {
    var wrapper = $('#menu');
    var menu = element('ul');

    $.each(flashcards, function(language, lists) {
        var languageWrapper = element('li');
        var languageMenu = element('ul');
        var header = element('h2', language, clickable);

        header.click(function() {
            $('#menu ul ul').hide();
            $(this).siblings().show();
        });

        $.each(lists, function(list, cards) {
            var link = element('span', list, clickable);

            link.click(function() {
                showList(language, list, cards, 'info');
            });

            languageMenu.append(element('li').append(link));
        });

        languageWrapper.append(header).append(languageMenu);
        menu.append(languageWrapper);
    });

    wrapper.empty().append(element('h1', 'Choose list')).append(menu);

    return wrapper;
}

$(function() {
    $.getJSON('ext/flashcards.json', function(data) {
        flashcards = data;
        showMenu();
    });
});
