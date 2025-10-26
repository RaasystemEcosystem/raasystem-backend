# events.py

def watch_contract_events(contract_name, callback):
    """
    Simulates watching smart contract events on the blockchain.

    Parameters:
    - contract_name (str): Name of the contract (e.g., 'Raaskoin', 'GoldPriceOracle').
    - callback (function): Callback function to handle the event.
    """
    print(f"[events] Watching events for {contract_name}")
    
    # Simulated event triggers based on contract
    if contract_name == "Raaskoin":
        mock_event = {"contract": contract_name, "args": {"eventType": "Trade", "price": 1010.0}}
        callback(mock_event)
    elif contract_name == "GoldPriceOracle":
        mock_event = {"contract": contract_name, "args": {"eventType": "PriceUpdate", "newPrice": 999.72}}
        callback(mock_event)
    elif contract_name in ["Raastoken", "Raaswallet"]:
        mock_event = {"contract": contract_name, "args": {"action": "Mint", "amount": 1000}}
        callback(mock_event)


def on_trade_event(event):
    """
    Handles trade events emitted from the Raaskoin contract.
    """
    try:
        price = event["args"].get("price")
        if price is not None:
            print(f"[events] Trade event detected on Raaskoin at price {price}")
        else:
            print("[events] Trade event received, but price is missing.")
    except Exception as e:
        print(f"[events] Error handling trade event: {str(e)}")


def on_price_update(event):
    """
    Handles price update events from GoldPriceOracle.
    """
    try:
        new_price = event["args"].get("newPrice")
        if new_price is not None:
            print(f"[events] Price update detected: {new_price}")
        else:
            print("[events] Price update received, but newPrice is missing.")
    except Exception as e:
        print(f"[events] Error handling price update: {str(e)}")


def on_token_event(event):
    """
    Handles token-related events from Raastoken or Raaswallet.
    """
    try:
        token_action = event["args"].get("action", "Unknown")
        amount = event["args"].get("amount", 0)
        print(f"[events] Token event detected: {token_action} of {amount}")
    except Exception as e:
        print(f"[events] Error handling token event: {str(e)}")
