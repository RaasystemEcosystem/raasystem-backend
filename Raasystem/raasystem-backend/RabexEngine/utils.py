# utils.py

def calculate_spread(bid_price, ask_price):
    """
    Calculates the percentage spread between bid and ask prices.
    """
    try:
        if ask_price == 0:
            raise ValueError("Ask price cannot be zero.")
        spread = (ask_price - bid_price) / ask_price
        return round(spread, 4)
    except Exception as e:
        print(f"[utils] Error calculating spread: {str(e)}")
        return 0.0


def format_order(order_type, price, quantity):
    """
    Formats an order object.
    """
    try:
        return {
            "type": order_type.lower(),
            "price": round(price, 6),
            "quantity": float(quantity)
        }
    except Exception as e:
        print(f"[utils] Error formatting order: {str(e)}")
        return {}


def round_price(price, decimals=2):
    """
    Rounds a price to the specified number of decimal places.
    """
    try:
        return round(float(price), decimals)
    except Exception as e:
        print(f"[utils] Error rounding price: {str(e)}")
        return price


def pause_trading(pair):
    """
    Simulates pausing trading for a specific pair.
    """
    print(f"[utils] Trading paused for pair: {pair}")


def log_engine_status(order_book, spread, predicted_price):
    """
    Logs the engine's current status.
    """
    print("\n=== Rabex Engine Status ===")
    print(f"Spread: {spread:.4f}")
    print(f"Predicted Price: {predicted_price}")
    print(f"Order Book: {order_book}")
    print("===========================\n")
