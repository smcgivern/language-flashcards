// Number of times each card needs to be guessed correctly.
var repetitions = 5;

// Placeholder for flashcards; loaded at the bottom of this file.
var flashcards = {};

function element(name, content, attributes) {
    var e = $(document.createElement(name));

    if (content) { e.append(content); }
    for (a in attributes) { e.attr(a, attributes[a]); }

    return e;
}

function showList(language, list, cards) {
    $('#language-title').empty().append(language);
    $('#list-title').empty().append(list);

    var cardList = cards;

    for (var i = 1; i < repetitions; i++) {
        cardList = cardList.concat(cards);
    }

    nextCard(cardList);
}

function nextCard(remainingCards) {
    remainingCards.sort(function() { return 0.5 - Math.random(); })

    currentCard = remainingCards.shift();

    $('#word').empty().append(currentCard[0]);
    $('#answer').val("").focus();

    $('#card').off('submit', 'form').on('submit', 'form', function() {
        checkAnswer(currentCard, remainingCards);
    });
}

function checkAnswer(card, remainingCards) {
    var answer = $('#answer').val().toLowerCase();

    if (answer != card[1]) {
        remainingCards.push(card);
        $('#result').empty().append('Uh-uh!');
    } else {
        $('#result').empty().append('Woo-hoo!');
    }

    nextCard(remainingCards);
}

function showMenu() {
    var wrapper = $('#menu');
    var menu = element('ul');

    $.each(flashcards, function(language, lists) {

        var languageWrapper = element('li');
        var languageMenu = element('ul');

        $.each(lists, function(list, cards) {
            var link = element('span', list, { class: 'click' });

            link.click(function() {
                showList(language, list, cards);
            });

            languageMenu.append(element('li').append(link));
        });

        languageWrapper.append(element('h2', language));
        languageWrapper.append(languageMenu);
        menu.append(languageWrapper);
    });

    wrapper.empty().append(element('h1', 'Menu')).append(menu);

    return wrapper;
}

$(function() {
    $.getJSON('ext/flashcards.json', function(data) {
        flashcards = data;
        showMenu();
    });
});
