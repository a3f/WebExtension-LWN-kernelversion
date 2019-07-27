var browser = browser || chrome;

function bsearch(arr, el) {
    var m = 0;
    var n = arr.length - 1;
    while (m <= n) {
        var k = (n + m) >> 1;
        var kval = Object.keys(arr[k])[0];
        if (el < kval)
            m = k + 1;
        else if(el > kval)
            n = k - 1;
        else
            return arr[k];
    }
    return arr[m];
}

function enhance(Byline, date) {
    date = Date.parse(date) / 1000;

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var el = document.createElement("div");
            var release = bsearch(JSON.parse(this.responseText).tags.times, date);
            var time = Object.keys(release)[0];
            var tag = Object.values(release)[0];

            el.style.color = "darkred";
            el.innerHTML = '<span title="' + new Date(time*1000) + '">' + tag + "</span> &mdash;";
            el.innerHTML += ' [<a href="https://github.com/torvalds/linux/tree/' + tag + '">Github</a>]';
            el.innerHTML += ' [<a href="https://elixir.bootlin.com/linux/' + tag + '/source">Elixir</a>]';

            Byline.insertBefore(el, null);
        }
    };

    xhttp.open("GET", browser.extension.getURL("tags.json"), true);
    xhttp.send();
}

function textNodesUnder(node) {
  var all = "";
  for (node = node.firstChild; node; node=node.nextSibling) {
    if (node.nodeType == 3) all += node.data;
    else all += textNodesUnder(node);
  }
  return all;
}

var date;
var regex = /((Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|June?|July?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s*\d\d?,\s*\d{4})/i;

var Byline = document.body.querySelector('div[class$="Byline"]');
if (Byline && (date = textNodesUnder(Byline).match(regex)))
    enhance(Byline, date[1]);
