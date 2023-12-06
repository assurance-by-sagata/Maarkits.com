import csv
import datetime
import pytz
import requests
import subprocess
import urllib
import uuid
import openai
import sqlite3

from flask import redirect, render_template, session
from functools import wraps

con = sqlite3.connect("finance.db", check_same_thread=False)
con.row_factory = sqlite3.Row
db = con.cursor()

def apology(message, code=400):
    """Render message as an apology to user."""

    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [
            ("-", "--"),
            (" ", "-"),
            ("_", "__"),
            ("?", "~q"),
            ("%", "~p"),
            ("#", "~h"),
            ("/", "~s"),
            ('"', "''"),
        ]:
            s = s.replace(old, new)
        return s

    return render_template("apology.html", top=code, bottom=escape(message)), code

def apology_test(message, code=400):
    """Render message as an apology to user."""

    def escape(s):
        """
        Escape special characters.

        https://github.com/jacebrowning/memegen#special-characters
        """
        for old, new in [
            ("-", "--"),
            (" ", "-"),
            ("_", "__"),
            ("?", "~q"),
            ("%", "~p"),
            ("#", "~h"),
            ("/", "~s"),
            ('"', "''"),
        ]:
            s = s.replace(old, new)
        return s

    return (message, code)


def login_required(f):
    """
    Decorate routes to require login.

    http://flask.pocoo.org/docs/0.12/patterns/viewdecorators/
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if session.get("user_id") is None:
            return redirect("/landing")
        return f(*args, **kwargs)

    return decorated_function

def total_computation(username):
    portfolio = db.execute(
        "SELECT * FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE username = (?))", (username, )
    )
    portfolio = [dict(i) for i in portfolio]
    cash = db.execute("SELECT * FROM users WHERE username = (?)", (username,))
    cash = [dict(i) for i in cash]
    cash = cash[0]["cash"]
    portfolio = [dict(i) for i in portfolio]
    total = cash
    for stock in portfolio:
        total += stock["price"] * stock["num_shares"]
    return total, cash

def leaderboard():
    """Test function for leaderboard"""
    usernames = db.execute("SELECT username FROM users LIMIT 10")
    usernames = [dict(i) for i in usernames]
    for username in usernames:
        username["total"] = total_computation(username["username"])[0]
    usernames = sorted(usernames, key=lambda a: a["total"], reverse=True)
    return usernames

def buy_test(symbol, user_id, num_shares):
    """Buy shares of stock"""
    stock = lookup(symbol)
    # Error checking (i.e. missing symbol, too many shares bought etc)
    if not stock:
        return 400
    if not num_shares.isdigit():
        return 400
    num_shares = int(num_shares)
    if num_shares < 0:
        return 400
    price = stock["price"]
    user = db.execute("SELECT * FROM users WHERE id = (?)", (user_id,))
    user = [dict(i) for i in user]
    if (num_shares * price) > user[0]["cash"]:
        return 400
    portfolio = db.execute(
        "SELECT * FROM portfolios WHERE user_id = (?) AND stock_symbol = (?)",
        (user_id,
        symbol)
    )
    portfolio = [dict(i) for i in portfolio]
    # Start a stock for a new user if it doesn't exist
    time = datetime.datetime.now(pytz.timezone("UTC")).strftime("%Y-%m-%d %H:%M:%S")
    if (len(portfolio)) == 0:
        db.execute(
            "INSERT INTO portfolios(user_id, stock_name, stock_symbol, price, num_shares, time_bought) VALUES(?, ?, ?, ?, ?, ?)",
            (user_id,
            stock["name"],
            stock["symbol"],
            price,
            num_shares,
            time)
        )
        con.commit()
        db.execute(
            "INSERT INTO history(user_id, stock_symbol, price, num_shares, time_of_transaction) VALUES(?, ?, ?, ?, ?)",
            (user_id,
            stock["symbol"],
            price,
            num_shares,
            time)
        )
        con.commit()
        db.execute(
            "UPDATE users SET cash = cash - (?) WHERE id = (?)",
            (num_shares * price,
            user_id)
        )
        con.commit()
    # Update current portfolio
    else:
        db.execute(
            # Fixed bug- update on pythonanywere
            "UPDATE portfolios SET price = (?), num_shares = num_shares + (?) WHERE user_id = (?) and stock_symbol = (?)",
            (price,
            num_shares,
            user_id,
            symbol)
        )
        con.commit()
        db.execute(
            "INSERT INTO history(user_id, stock_symbol, price, num_shares, time_of_transaction) VALUES(?, ?, ?, ?, ?)",
            (user_id,
            symbol,
            price,
            num_shares,
            time)
        )
        con.commit()
        db.execute(
            "UPDATE users SET cash = cash - (?) WHERE id = (?)",
            (num_shares * price,
            user_id)
        )
        con.commit()
        
def sell_test(symbol, user_id, num_shares):
    """Sell shares of stock"""
    valid_symbols = db.execute(
        "SELECT stock_symbol FROM portfolios WHERE user_id = (?)", (user_id,)
    )
    valid_symbols = [dict(i) for i in valid_symbols]
    stock = db.execute(
        "SELECT * FROM portfolios WHERE stock_symbol = (?) AND user_id = (?)",
        (symbol,
        user_id)
    )
    stock = [dict(i) for i in stock]
    # Error checking (i.e. missing symbol, too many shares sold etc)
    if len(stock) != 1:
        return 400
    if not num_shares.isdigit():
        return 400
    num_shares = (int(num_shares)) * -1
    if num_shares > 0:
        return 400
    if stock[0]["num_shares"] + num_shares < 0:
        return 400
    # Keep track of sells
    time = datetime.datetime.now(pytz.timezone("UTC")).strftime("%Y-%m-%d %H:%M:%S")
    # Update current portfolio
    price = lookup(symbol)["price"]
    if stock[0]["num_shares"] + num_shares == 0:
        db.execute(
            "DELETE FROM portfolios WHERE user_id = (?) AND stock_symbol = (?)",
            (user_id,
            symbol)
        )
        con.commit()
        db.execute(
            "INSERT INTO history(user_id, stock_symbol, price, num_shares, time_of_transaction) VALUES(?, ?, ?, ?, ?)",
            (user_id,
            symbol,
            price,
            num_shares,
            time)
        )
        con.commit()
        db.execute(
            "UPDATE users SET cash = cash - (?) WHERE id = (?)",
            (num_shares * price,
            user_id)
        )
        con.commit()
    else:
        db.execute(
            "UPDATE portfolios SET price = (?), num_shares = num_shares + (?) WHERE user_id = (?) AND stock_symbol = (?)",
            (price,
            num_shares,
            user_id,
            symbol)
        )
        con.commit()
        db.execute(
            "INSERT INTO history(user_id, stock_symbol, price, num_shares, time_of_transaction) VALUES(?, ?, ?, ?, ?)",
            (user_id,
            symbol,
            price,
            num_shares,
            time)
        )
        con.commit()
        db.execute(
            "UPDATE users SET cash = cash - (?) WHERE id = (?)",
            (num_shares * price,
            user_id)
        )
        con.commit()

def lookup(symbol):
    """Look up quote for symbol."""

    # Prepare API request
    symbol = symbol.upper()
    end = datetime.datetime.now(pytz.timezone("US/Eastern"))
    start = end - datetime.timedelta(days=7)

    # Yahoo Finance API
    url = (
        f"https://query1.finance.yahoo.com/v7/finance/download/{urllib.parse.quote_plus(symbol)}"
        f"?period1={int(start.timestamp())}"
        f"&period2={int(end.timestamp())}"
        f"&interval=1d&events=history&includeAdjustedClose=true"
    )

    # Query API
    try:
        response = requests.get(
            url,
            cookies={"session": str(uuid.uuid4())},
            headers={"User-Agent": "python-requests", "Accept": "*/*"},
        )
        response.raise_for_status()

        # CSV header: Date,Open,High,Low,Close,Adj Close,Volume
        quotes = list(csv.DictReader(response.content.decode("utf-8").splitlines()))
        quotes.reverse()
        price = round(float(quotes[0]["Adj Close"]), 2)
        return {"name": symbol, "price": price, "symbol": symbol}
    except (requests.RequestException, ValueError, KeyError, IndexError):
        return None


def usd(value):
    """Format value as USD."""
    return f"${value:,.2f}"

def answer(question):
    """Get answer to user question"""
    openai.api_key = "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"
    prompt = question 
    response = openai.Completion.create(
        engine="text-davinci-003",
        prompt=prompt,
        max_tokens=1000
    )
    response = response.choices[0].text
    # expiryList = expiry.strip().split("!")

    return response