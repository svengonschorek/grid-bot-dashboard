from flask import Flask, render_template, jsonify
from binance.client import Client

import os
import datetime

app = Flask(__name__)

client = Client(os.getenv("BINANCE_API_KEY"), os.getenv("BINANACE_API_SECRET"))

@app.route("/")
def index():
    return render_template('index.html')

@app.route('/history')
def history():
    candlesticks = client.get_historical_klines("SOLBUSD", Client.KLINE_INTERVAL_5MINUTE, "1 day ago UTC")

    processed_candlesticks = []

    for data in candlesticks:
        candlestick = { 
            "time": data[0] / 1000, 
            "open": data[1],
            "high": data[2], 
            "low": data[3], 
            "close": data[4]
        }

        processed_candlesticks.append(candlestick)

    return jsonify(processed_candlesticks)

@app.route('/trade_history')
def trade_history():
    startTime = int(((
        datetime.datetime.utcnow() - datetime.timedelta(days=1)
        ) - datetime.datetime.fromtimestamp(0)
    ).total_seconds() * 1000)
    trades = client.get_my_trades(symbol="SOLBUSD", startTime=startTime)

    processed_trades = []

    for trade in trades:
        tradepoint = {
            "time": int(trade["time"] / 1000),
            "buy": trade["isBuyer"],
            "price": trade["price"][:5],
            "qty": trade["qty"]
        }
    
        processed_trades.append(tradepoint)

    return jsonify(processed_trades)
