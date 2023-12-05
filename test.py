from helpers import lookup

def test_lookup():
    assert(lookup("TSLA")["symbol"] == "TSLA")
    assert(lookup("TSLA")["name"] == "TSLA")
    assert(lookup("GOOG")["name"] == "GOOG")