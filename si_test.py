from helpers import lookup
from helpers import apology_test

def test_lookup():
    assert(lookup("TSLA")["symbol"] == "TSLA")
    assert(lookup("TSLA")["name"] == "TSLA")
    assert(lookup("GOOG")["name"] == "GOOG")
    
def test_apology():
    assert(apology_test("Sorry") == ("Sorry", 400))
    assert(apology_test("Good!", 200) == ("Good!", 200))