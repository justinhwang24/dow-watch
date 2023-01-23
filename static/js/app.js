const baseurl = "file:///Users/acesjus/Desktop/vscode/html/dow-watch/index.html";
const url = "https://cloud.iexapis.com/stable/";
const key = "pk_e35d61ecf6094c8fbd147ec84ae30083";
const btn = document.getElementById("btn");
const stocks = ['aapl', 'msft', 'googl', 'goog', 'amzn', 'tsla', 'brk.b', 'fb', 'nvda', 'jnj', 'unh', 'v', 'xom', 'jpm', 'pg', 'cvx', 'wmt', 'ma', 'hd', 'pfe', 'bac', 'lly', 'abbv', 'ko', 'mrk', 'avgo', 'pep', 'tmo', 'vz', 'abt', 'cmcsa', 'dis', 'cost', 'adbe'];

async function getapi(arg) {
    var http = new XMLHttpRequest();
    http.open('HEAD', arg, false);
    http.send();
    if (http.status == 404) {
        //  do something
        document.getElementById("loading").innerHTML = '<span>We couldn\'t find any match for your search.<span><br><br>' +
            '<a id="back" href="index.html">← Back to Stock Watch</a>';
        document.getElementById("back").style = "color: blue";
        return;
    }
    else {
        const response = await fetch(arg);
        var data = await response.json();
        if (response) {
            hideloader();
        }
        show(data);
    }
}

function hideloader() {
    document.getElementById("loading").style.display = 'none';
}

function getRandomTicker() {
    let i = Math.floor(Math.random() * stocks.length);
    console.log(i + ", " + stocks.length);
    console.log(stocks[i]);
    return stocks[i];
}

// Function to define innerHTML for HTML table
function show(data) {
    let up = false;
    if (data["change"] >= 0) {
        up = true;
    }
    let price = (Math.round(100 * data["latestPrice"]) / 100.00).toLocaleString(undefined, { minimumFractionDigits: 2 });
    let todayChange = (Math.round(100.00 * data["change"]) / 100.00).toLocaleString(undefined, { minimumFractionDigits: 2 });
    let pct = (Math.round(100 * 100.00 * data["changePercent"]) / 100.00).toLocaleString(undefined, { minimumFractionDigits: 2 }) + "%";
    
    let str = `
        <h4 class="query" id="symbols">${data["symbol"] + ' • ' + data["primaryExchange"]}</h4>
        <h3 class="query" id="companyName">${data["companyName"]}</h3>
        <h1 class="query" id="latestPrice">${price}</h1>
        <h4 class="query" id="change">${(up ? "▲ " : "▼ ") + todayChange + " (" + pct + ") Today"}</h4>`;
    document.getElementById("results").innerHTML = str;
    document.getElementById("change").style = up ? "color:green" : "color:hsl(360, 67%, 44%)";
}

function submit() {
    let input = document.getElementById('search-input').value
    input = input.toLowerCase();
    window.location = baseurl + "?quote=" + input;
    getapi(url + "stock/" + input + "/quote?token=" + key);
}

function postData(input) {
    $.ajax({
        type: "GET",
        url: "http://localhost:8000/read_csv.py",
        data: { param: input },
        success: callbackFunc
    });
}

function callbackFunc(response) {
    // do something with the response
    console.log(response);
}

// btn.addEventListener("click", function() {
//     const data = getapi(url + "stock/aapl/quote?token=" + key);
// });
let index = window.location.href.indexOf("?quote=");
if (index >= 0) {
    getapi(url + "stock/" + window.location.href.substring(index + 7) + "/quote?token=" + key);
}
else {
    getapi(url + "stock/" + getRandomTicker() + "/quote?token=" + key);
}

document.getElementById('search-input').onkeydown = function(e){
    if (e.code == "Enter"){
        submit();
    }
};
postData();