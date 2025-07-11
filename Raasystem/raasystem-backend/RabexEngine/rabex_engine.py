# rabex_engine.py

import json
from contracts import load_contract
from ai_model import load_model, calculate_volatility, dynamic_spread, sudden_price_shift
from order_book import place_limit_order, widen_spread
from rebalance import calculate_optimal_pool_balance, execute_rebalancing
from events import watch_contract_events, on_trade_event, on_price_update
from utils import pause_trading, log_engine_status

def run_engine():
    # Initialization
    raaskoin = load_contract("Raaskoin")
    oracle = load_contract("GoldPriceOracle")
    wallet_interface = load_contract("Raaswallet")

    PAIR = "RAASKOIN/USDT"
    LIQUIDITY_DEPTH = 10000
    SPREAD_BOUNDS = (0.1, 0.5)

    ai_model = load_model("price_predictor_v1.pkl")

    # Fetch Real-Time Data
    gold_price = oracle.get_latest_price()
    predicted_price = ai_model.predict_next(gold_price)

    volatility_index = calculate_volatility()
    spread = dynamic_spread(volatility_index, SPREAD_BOUNDS)

    # Order Book Logic
    best_bid = predicted_price * (1 - spread / 2)
    best_ask = predicted_price * (1 + spread / 2)

    order_book = {
        "bid": place_limit_order("buy", best_bid, LIQUIDITY_DEPTH),
        "ask": place_limit_order("sell", best_ask, LIQUIDITY_DEPTH)
    }

    # Price Protection
    if sudden_price_shift(predicted_price, gold_price):
        pause_trading("RAASKOIN")

    if volatility_index > 0.8:
        widen_spread(order_book, 0.6)

    # Rebalancing
    rebalance_strategy = calculate_optimal_pool_balance()
    execute_rebalancing(rebalance_strategy)

    # Event Monitoring (optional — not relevant for one-time calls from Node)
    # watch_contract_events("Raaskoin", on_trade_event)
    # watch_contract_events("GoldPriceOracle", on_price_update)

    # Logging (optional)
    log_engine_status(order_book, spread, predicted_price)

    # Return engine result as JSON
    return {
        "predicted_price": predicted_price,
        "spread": spread,
        "volatility": volatility_index,
        "order_book": order_book
    }

# CLI execution
if __name__ == "__main__":
    result = run_engine()
    print(json.dumps(result))  # This is what Node will read and parse
