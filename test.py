from helpers import lookup
from helpers import apology_test
from helpers import total_computation
import sqlite3


con = sqlite3.connect("finance.db", check_same_thread=False)
con.row_factory = sqlite3.Row
db = con.cursor()

def test_lookup():
    assert(lookup("TSLA")["symbol"] == "TSLA")
    assert(lookup("TSLA")["name"] == "TSLA")


def test_total():
    cash = db.execute("SELECT * FROM users WHERE username = (?)", ("arman",))
    cash = [dict(i) for i in cash]
    cash = cash[0]["cash"]
    assert(total_computation("arman")[1] == cash)