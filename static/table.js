
var trades = [];
fetch('/trade_history')
    .then((r) => r.json())
    .then((response) => {
        var table = document.getElementById('table');
  
        var tableBody = document.createElement('TBODY');
        table.appendChild(tableBody);

        for (var i = response.length - 1; i >= 0; i--) {
            var tr = document.createElement('TR');
            tableBody.appendChild(tr);
            if (response[i].buy) {
                for (var j = 0; j < 1; j++) {
                    var td1 = document.createElement('TD');
                var td2 = document.createElement('TD');
                var ts = new Date(response[i].time * 1000);
                td1.appendChild(document.createTextNode(ts.toISOString().split('.')[0]))
                td2.appendChild(document.createTextNode('Buy @ ' + response[i].price+ ' BUSD'));
                tr.style.color = "#2196F3";
                tr.appendChild(td1);
                tr.appendChild(td2);
                }
            } else {
                var td1 = document.createElement('TD');
                var td2 = document.createElement('TD');
                var ts = new Date(response[i].time * 1000);
                td1.appendChild(document.createTextNode(ts.toISOString().split('.')[0]))
                td2.appendChild(document.createTextNode('Sell @ ' + response[i].price + ' BUSD'));
                tr.style.color = "#e91e63";
                tr.appendChild(td1);
                tr.appendChild(td2);
            }
        }
        myTableDiv.appendChild(table);
    })
