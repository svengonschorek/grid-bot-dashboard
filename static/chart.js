var chart = LightweightCharts.createChart(document.getElementById('chart'), {
    width: 0,
    height: 0,
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    priceScale: {
        borderColor: '#cccccc',
    },
    leftPriceScale: {
        visible: true,
        borderColor: '#cccccc'
    },
    timeScale: {
        borderColor: '#cccccc',
        timeVisible: true,
    }
});

var candleSeries = chart.addCandlestickSeries();

fetch('/history')
	.then((r) => r.json())
	.then((response) => {
		candleSeries.setData(response);
	})

var binanceSocket = new WebSocket("wss://stream.binance.com:9443/stream?streams=solbusd@kline_5m");

binanceSocket.onmessage = function (event) {	
	var message = JSON.parse(event.data);

	var candlestick = message.data.k;

	candleSeries.update({
		time: candlestick.t / 1000,
		open: candlestick.o,
		high: candlestick.h,
		low: candlestick.l,
		close: candlestick.c
	})
}

var markers = [];
fetch('/trade_history')
    .then((r) => r.json())
    .then((response) => {
        for (let i=0; i<response.length; i++) {
            if (response[i].buy) {
                markers.push({
                    time: response[i].time - 300,
                    position: 'belowBar',
                    color: '#2196F3',
                    shape: 'arrowUp',
                    text: response[i].qty.substring(0, 4) + 'x Buy @ ' + response[i].price,
                });
            } else {
                markers.push({
                    time: response[i].time - 300,
                    position: 'aboveBar',
                    color: '#e91e63',
                    shape: 'arrowDown',
                    text: response[i].qty.substring(0, 4) + 'x Sell @ ' + response[i].price,
                });
            }
        }
        candleSeries.setMarkers(markers);
    })
