from helpers import lookup
from helpers import apology_test

def test_lookup():
    assert(lookup("TSLA")["symbol"] == "TSLA")
    assert(lookup("TSLA")["name"] == "TSLA")
