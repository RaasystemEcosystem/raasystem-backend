# contracts.py

def load_contract(name):
    print(f"[contracts] Loaded contract: {name}")
    return Contract(name)


class Contract:
    def __init__(self, name):
        self.name = name

    def get_latest_price(self):
        if self.name == "GoldPriceOracle":
            print(f"[{self.name}] Fetching latest price...")
            return 999.72  # Simulated real-time gold price
        return 0

    def trigger_event(self, event_name):
        print(f"[{self.name}] Event triggered: {event_name}")

    def interact(self, data):
        print(f"[{self.name}] Executing transaction with data: {data}")
        return {"status": "success", "tx_hash": "0xABC123"}
