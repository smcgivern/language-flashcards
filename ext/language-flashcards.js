var flashcards = {
    "Spanish": {
        "Regular verbs": [
            ["hablar", "to speak"],
            ["comer", "to eat"],
            ["beber", "to drink"]
        ]
    }
};

var u = encodeURIComponent;

function element(name, content, attributes) {
    var e = $(document.createElement(name));

    if (content) { e.append(content); }
    for (a in attributes) { e.attr(a, attributes[a]); }

    return e;
}

function showMenu() {
    var wrapper = $('#menu');
    var menu = element('ul');

    $.each(flashcards, function(language, lists) {
        var languageWrapper = element('li');
        var languageMenu = element('ul');

        $.each(lists, function(list, cards) {
            var link = element('a', list, {
                href: '#language=' + u(language) +
                    ';list=' + u(list),
            });

            languageMenu.append(element('li').append(link));
        });

        languageWrapper.append(element('h2', language));
        languageWrapper.append(languageMenu);
        menu.append(languageWrapper);
    });

    wrapper.empty();
    wrapper.append(element('h1', 'Menu')).append(menu);

    return wrapper;
}

$(function() { showMenu(); });
