from helpers import lookup

def test_lookup():
    assert(lookup("TSLA")["symbol"] == "T")