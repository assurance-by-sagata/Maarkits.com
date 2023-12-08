from helpers import lookup
from helpers import apology_test
from helpers import total_computation
from helpers import leaderboard
from helpers import buy_test, sell_test
import sqlite3


con = sqlite3.connect("finance.db", check_same_thread=False)
con.row_factory = sqlite3.Row
db = con.cursor()

def test_buy_sell():
    portfolio = db.execute(
        "SELECT * FROM portfolios WHERE user_id = (?)", (16, )
    )
    portfolio = [dict(i) for i in portfolio]
    assert(len(portfolio) == 0)
    # Test buy capabilities
    buy_test("TSLA", "16", "5")
    assert(buy_test("GOOG", "16", "1000000") == 400)
    portfolio = db.execute(
        "SELECT * FROM portfolios WHERE user_id = (?)", (16, )
    )
    
    # Test sell capabilities
    portfolio = [dict(i) for i in portfolio]
    assert(portfolio[0]["stock_name"] == "Tesla, Inc.")
    assert(portfolio[0]["stock_symbol"] == "TSLA")
    assert(portfolio[0]["num_shares"] == 5)
    assert(sell_test("TSLA", "16", "10") == 400)
    sell_test("TSLA", "16", "5")
    portfolio = db.execute(
        "SELECT * FROM portfolios WHERE user_id = (?)", (16, )
    )
    portfolio = [dict(i) for i in portfolio]
    assert(len(portfolio) == 0)
    

def test_total():
    portfolio = db.execute(
        "SELECT * FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE username = (?))", ("arman", )
    )
    portfolio = [dict(i) for i in portfolio]
    cash = db.execute("SELECT * FROM users WHERE username = (?)", ("arman",))
    cash = [dict(i) for i in cash]
    cash = cash[0]["cash"]
    assert(total_computation("arman") == (cash + portfolio[0]["price"] * portfolio[0]["num_shares"], cash))
    
def test_leaderboard():
    assert(len(leaderboard()) == 10)
    for i in range(9):
        assert(leaderboard()[i]["total"] >= leaderboard()[i + 1]["total"])