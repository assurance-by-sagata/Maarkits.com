from helpers import lookup
from helpers import apology_test
from helpers import total_computation
from helpers import leaderboard
from helpers import buy_test, sell_test
import psycopg2
from psycopg2.extras import RealDictCursor

con = psycopg2.connect(dbname="postgres", user="postgres", password="Saucepan03@!", host="db.krvuffjhmqiyerbpgqtv.supabase.co")
db = con.cursor(cursor_factory=RealDictCursor)


def test_lookup():
    assert(lookup("TSLA")["symbol"] == "TSLA")
    assert(lookup("TSLA")["name"] == "Tesla, Inc.")
    assert(lookup("GOOG")["name"] == "Alphabet Inc.")
    
def test_apology():
    assert(apology_test("Sorry") == ("Sorry", 400))
    assert(apology_test("Good!", 200) == ("Good!", 200))
    
def test_buy_sell():
    db.execute(
        "SELECT * FROM portfolios WHERE user_id = (%s)", (2, )
    )
    portfolio = db.fetchall()
    assert(len(portfolio) == 0)
    # Test buy capabilities
    assert(buy_test("TSLA", "2", "5") == 200)
    assert(buy_test("GOOG", "2", "1000000") == 400)
    db.execute(
        "SELECT * FROM portfolios WHERE user_id = (%s)", (2, )
    )
    portfolio = db.fetchall()
    print(portfolio)
    # Test sell capabilities
    assert(portfolio[0]["stock_name"] == "Tesla, Inc.")
    assert(portfolio[0]["stock_symbol"] == "TSLA")
    assert(portfolio[0]["num_shares"] == 5)
    assert(sell_test("TSLA", "2", "10000000") == 400)
    assert(sell_test("TSLA", "2", "5") == 200)
    db.execute(
        "SELECT * FROM portfolios WHERE user_id = (%s)", (2, )
    )
    portfolio = db.fetchall()
    assert(len(portfolio) == 0)
    

def test_total():
    db.execute(
        "SELECT * FROM portfolios WHERE user_id IN (SELECT id FROM users WHERE username = (%s))", ("ss", )
    )
    portfolio = db.fetchall()
    db.execute("SELECT * FROM users WHERE username = (%s)", ("ss",))
    cash = db.fetchall()
    cash = float(cash[0]["cash"])
    total = cash
    for stock in portfolio:
        total += stock["price"] * stock["num_shares"]
    assert(total_computation("ss") == (total, cash))
    
def test_leaderboard():
    assert(len(leaderboard()) == 10)
    for i in range(9):
        assert(leaderboard()[i]["total"] >= leaderboard()[i + 1]["total"])