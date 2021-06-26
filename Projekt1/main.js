const getAllInputs = () => document.getElementsByClassName('input-number');

function recalculate() {
    const elements = Array.from(getAllInputs()).map(
        el => el.value ? parseInt(el.value) : null
    ).filter(el => typeof el === 'number');
    var results = document.getElementById('results'), resultText = '';
    if (elements.length < 1) {
        results.innerHTML = '';
        return;
    }
    var sum = elements.reduce((value, el) => value + el, 0);
    resultText = 'Suma: ' + sum;
    resultText += '<br/>Średnia: ' + sum/elements.length;
    resultText += '<br/>Min: ' + Math.min(...elements);
    resultText += '<br/>Max: ' + Math.max(...elements);
    results.innerHTML = resultText;
}

function updateInputs() {
    var count = parseInt(document.getElementById('input-count').value);
    if (typeof count === 'NaN') return;
    var content = document.getElementById('inputs');
    var oldCount = content.childNodes.length-1;
    for (var i = oldCount; i !== count; i < count ? i++ : i--) {
        if (i < count) {
            let input = new Input();
            input.appendTo(content);
        } else {
            content.removeChild(content.lastChild);
        }
    }
    recalculate();
}

class Input {
    node;

    constructor() {
        this.node = document.createElement('div');
        let input = document.createElement('input');
        input.className = 'input-number';
        input.type = 'number';
        input.onchange = recalculate
        this.node.appendChild(input);
    }

    appendTo(parent) {
        parent.appendChild(this.node);
    }
}