from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import requests

app = FastAPI()

API_URL = "https://financialmodelingprep.com/api/v3/income-statement/AAPL"
API_KEY = "Dl9QItybedcwXsHa0HgcTyczhTZ680bM"

# This variable will hold the fetched data once it's retrieved
cached_data = []

# Set middleware to allow local get request
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Fetch the data once when the app starts
@app.on_event("startup")
async def fetch_data_on_startup():
    global cached_data
    try:
        # Make the API request and store the data in `cached_data`
        response = requests.get(f"{API_URL}?period=annual&apikey={API_KEY}")
        response.raise_for_status()
        data = response.json()

        # Keep only the necessary fields
        cached_data = [
            {
                "date": item["date"],
                "revenue": item["revenue"],
                "netIncome": item["netIncome"],
                "grossProfit": item["grossProfit"],
                "eps": item["eps"], 
                "operatingIncome": item["operatingIncome"]
            }
            for item in data
        ]
    except Exception as e:
        print(f"Error fetching data: {e}")
        cached_data = []

@app.get("/data")
async def get_data(
    date_from: Optional[str] = Query(None),
    date_to: Optional[str] = Query(None),
    revenue_min: Optional[str] = Query(None),
    revenue_max: Optional[str] = Query(None),
    net_income_min: Optional[str] = Query(None),
    net_income_max: Optional[str] = Query(None),
    sort: Optional[str] = Query("dateAsc")
):
    try:
        # Use the cached data
        data = cached_data

        if not data:
            return {"error": "Data not available. Try again later."}

        # filter
        if date_from or date_to:
            data = [
                item
                for item in data
                if (not date_from or int(item["date"][:4]) >= int(date_from))  
                and (not date_to or int(item["date"][:4]) <= int(date_to))
            ]

        if revenue_min or revenue_max:
            data = [
                item
                for item in data
                if (not revenue_min or float(item["revenue"]) >= float(revenue_min))  
                and (not revenue_max or float(item["revenue"]) <= float(revenue_max))
            ]

        if net_income_min or net_income_max:
            data = [
                item
                for item in data
                if (not net_income_min or float(item["netIncome"]) >= float(net_income_min))  
                and (not net_income_max or float(item["netIncome"]) <= float(net_income_max))
            ]

        # sort
        if sort == "dateAsc":
            data.sort(key=lambda x: x["date"])
        elif sort == "dateDesc":
            data.sort(key=lambda x: x["date"], reverse=True)
        elif sort == "revenueAsc":
            data.sort(key=lambda x: x["revenue"])
        elif sort == "revenueDesc":
            data.sort(key=lambda x: x["revenue"], reverse=True)
        elif sort == "netIncomeAsc":
            data.sort(key=lambda x: x["netIncome"])
        elif sort == "netIncomeDesc":
            data.sort(key=lambda x: x["netIncome"], reverse=True)

        return data
    except Exception as e:
        return {"error": str(e)}
