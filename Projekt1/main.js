const getAllInputs = () => document.getElementsByClassName('input-number');

function recalculate() {
    const elements = Array.from(getAllInputs()).map(
        el => el.value ? parseInt(el.value) : null
    ).filter(el => typeof el === 'number');
    var results = document.getElementById('results'), resultText = '';
    var sum = elements.reduce((value, el) => value + el, 0);
    resultText = 'Suma: ' + sum;
    resultText += '<br/>Średnia: ' + sum/elements.length;
    resultText += '<br/>Min: ' + Math.min(...elements);
    resultText += '<br/>Max: ' + Math.max(...elements);
    results.innerHTML = resultText;
}