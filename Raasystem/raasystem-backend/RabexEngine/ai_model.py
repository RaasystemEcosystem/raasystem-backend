# ai_model.py

def load_model(model_name):
    print(f"[ai_model] Loaded model: {model_name}")
    return PricePredictor()


class PricePredictor:
    def predict_next(self, current_price):
        print(f"[ai_model] Predicting next price based on {current_price}")
        return round(current_price * 1.01, 2)  # Simulate a 1% upward prediction


def calculate_volatility():
    return 0.26  # Simulated volatility index (0 to 1 scale)


def dynamic_spread(volatility, bounds):
    low, high = bounds
    spread = low + (high - low) * volatility
    return round(spread, 4)


def sudden_price_shift(predicted, actual):
    return abs(predicted - actual) > 50  # Trigger if jump is more than 50
