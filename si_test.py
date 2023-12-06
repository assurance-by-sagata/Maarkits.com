from helpers import lookup
from helpers import apology_test

con = sqlite3.connect("finance.db", check_same_thread=False)
con.row_factory = sqlite3.Row
db = con.cursor()


def test_lookup():
    assert(lookup("TSLA")["symbol"] == "TSLA")
    assert(lookup("TSLA")["name"] == "TSLA")
    assert(lookup("GOOG")["name"] == "GOOG")
    
def test_apology():
    assert(apology_test("Sorry") == ("Sorry", 400))
    assert(apology_test("Good!", 200) == ("Good!", 200))
    
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