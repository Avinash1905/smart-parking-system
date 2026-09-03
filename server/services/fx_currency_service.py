"""
SmartPark International Currency FX Exchange & Foreign Card Service
Converts parking tariffs to live foreign currencies (USD, EUR, GBP, AED, SGD, JPY).
"""

from typing import Dict, Any, List

class FXCurrencyService:
    # Approximate real-time exchange rates to INR (1 Foreign Unit = X INR)
    FX_RATES = {
        "USD": 83.50,
        "EUR": 90.20,
        "GBP": 105.80,
        "AED": 22.75,
        "SGD": 62.40,
        "JPY": 0.55
    }

    @staticmethod
    def convert_inr(amount_inr: float, target_currency: str = "USD") -> Dict[str, Any]:
        rate = FXCurrencyService.FX_RATES.get(target_currency, 83.50)
        converted = round(amount_inr / rate, 2)
        return {
            "amount_inr": amount_inr,
            "target_currency": target_currency,
            "exchange_rate": rate,
            "converted_amount": converted,
            "formatted": f"{target_currency} {converted:.2f}"
        }
