'use strict';

// globally initialized variables
var next     = 0,
    prev     = 0,
    homeTmpl = '/tmpl/home.html';

var app,
    len,
    terms,
    items,
    group,
    current,
    termList,
    groupList,
    targetElement;

// load content
function loadContent(file) {
    current = 'single';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', file);
    xhr.send();

    xhr.addEventListener('load', function() {
        app.innerHTML = this.responseText;

        app.querySelector('.group').innerText = group;

        termList = app.querySelector('.term-list');

        var str = '';
        var tabindex = 0;

        for ( var i in terms[group] ) {
            str +=  [
                '<li tabindex="'+ ++tabindex +'">',
                    '<div class="kui-list-cont">',
                        '<p class="kui-pri">'+ terms[group][i].title +'</p>',
                        '<p class="kui-sec">'+ terms[group][i].content +'</p>',
                    '</div>',
                '</li>'
            ].join('');
        }

        termList.innerHTML = str;

        items = termList.getElementsByTagName('li');
        next  = 0;
        len   = items.length;        

        // step 1
        document.activeElement.addEventListener('keydown', handleKeydown);
        
        // step 2
        items[next].focus();
    });
}

// handle keydown
function handleKeydown(e) {
    switch (e.key) {
        case 'ArrowUp':
            nav(-1);
            break;
        case 'ArrowDown':
            nav(1);
            break;
        case 'ArrowRight':
            nav(1);
            break;
        case 'ArrowLeft':
            nav(-1);
            break;

        case 'Backspace':
            history.back();

            console.log(current);
            

            if ( 'home' === current ) {
                e.preventDefault();
            }
            break;

        case 'Enter':
            prev = next;

            group = e.target.dataset.key;
            
            var file = '/tmpl/single.html';
            loadContent(file);

            history.pushState(null, null, file);
            break;

        case 'Shift':
            showOptionMenu();
            break;
    }
}

// navigation
function nav(move) {
    next = next + move;
    targetElement = items[next];

    if ( 'undefined' === typeof targetElement ) {
        if ( next === len ) {
            next = 0;
        } else if ( next < 0 ) {
            next = len - 1;
        }

        targetElement = items[next];
    }

    targetElement.focus();
}

function setupHomeTmpl() {
    app.innerHTML = this.responseText;

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/terms.json');
    xhr.send();
    xhr.addEventListener('load', function() {
        terms = JSON.parse(this.responseText);

        groupList = document.getElementById('group-list');

        var str = '';
        var tabindex = 0;

        for ( var i in terms ) {
            str +=  [
                '<li tabindex="'+ ++tabindex +'" data-key="'+ i +'">',
                    '<div class="kui-list-img"><span>'+ i +'</span></div>',
                    '<div class="kui-list-cont">',
                        '<p class="kui-pri">Group <span>'+ i +'</span></p>',
                        '<p class="kui-sec">Terms start with letter '+ i +'</p>',
                    '</div>',
                '</li>'
            ].join('');
        }

        groupList.innerHTML = str;

        items = groupList.getElementsByTagName('li');
        len   = items.length;        

        // step 1
        document.activeElement.addEventListener('keydown', handleKeydown);

        // step 2
        if (prev) {
            items[prev].focus();
        } else {
            items[next].focus();
        }
    });
}

// load home template
function loadHomeTmpl() {
    app     = document.getElementById('kui-app');
    current = 'home';

    var xhr = new XMLHttpRequest();
    xhr.open('GET', homeTmpl);
    xhr.send();
    xhr.addEventListener('load', setupHomeTmpl);
}

// load length template
function loadLengthTmpl() {
    inputHolder = app.querySelector('.kui-input-holder');
    overlay     = document.querySelector('.overlay');
    options     = document.querySelector('.kui-options');
    optionMenu  = document.querySelector('.kui-option-menu');
    softwareKey = document.querySelector('.kui-software-key');
    items       = document.getElementsByClassName('kui-input');

    len   = items.length;
    next  = 0;
    items[next].focus();
}

// after DOM load
window.addEventListener('load', function() {
    // initialize home template
    loadHomeTmpl();

    // when back key is pressed
    window.onpopstate = function(e) {        
        loadHomeTmpl();
    };
});
