# order_book.py

def place_limit_order(order_type, price, quantity):
    print(f"[order_book] Placing {order_type} order: {quantity} @ {price}")
    return {
        "type": order_type,
        "price": price,
        "quantity": quantity
    }


def widen_spread(order_book, new_spread_percentage):
    bid = order_book["bid"]
    ask = order_book["ask"]

    midpoint = (bid["price"] + ask["price"]) / 2
    spread = new_spread_percentage / 2

    new_bid_price = round(midpoint * (1 - spread), 6)
    new_ask_price = round(midpoint * (1 + spread), 6)

    order_book["bid"]["price"] = new_bid_price
    order_book["ask"]["price"] = new_ask_price

    print(f"[order_book] Widened spread. New Bid: {new_bid_price}, New Ask: {new_ask_price}")
