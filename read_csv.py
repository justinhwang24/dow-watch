import csv
import sys
import requests

def main():
    print(getCAPM('V', 'S&P 500'))
    # print(getTreasuryBonds())

def getCAPM(ticker, index):
    rf = getTreasuryBonds()
    rm = 10
    beta = covariance(ticker, index) / variance(index)
    betaNew = (1 - 1/3) * beta + 1/3
    # betaNew = beta
    print(rf, rm, betaNew)
    return rf + betaNew * (rm - rf)

def getTreasuryBonds():
    response = requests.get("https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates?filter=security_desc:eq:Treasury Bonds&sort=-record_date")
    return float(response.json()["data"][0]["avg_interest_rate_amt"])

def getData(ticker, data):
    with open(f'data/{ticker} Historical Data.csv', mode='r') as csv_file:
        csv_reader = csv.DictReader(csv_file)
        prices = {}
        line_count = 0
        for row in csv_reader:
            newRow = convert_row(row)
            if line_count == 0:
                print(f"Column names are {', '.join(newRow)}")
            print(newRow)
            if data == "Change %":
                prices[newRow["\"Date\""]] = float(newRow[data][:-1].replace(',', ''))
            else:
                prices[newRow["\"Date\""]] = float(newRow[data].replace(',', ''))
            line_count += 1
    return prices

def covariance(ticker1, ticker2):
    prices1 = getData(ticker1, "Change %")
    prices2 = getData(ticker2, "Change %")
    average1 = sum(prices1.values()) / len(prices1)
    average2 = sum(prices2.values()) / len(prices2)
    tot = 0
    for i in range(len(prices1)):
        tot += (list(prices1.values())[i] - average1) * (list(prices2.values())[i] - average2)
    return tot / (len(prices1) - 1)

def variance(ticker):
    prices = getData(ticker, "Change %")
    average = sum(prices.values()) / len(prices)
    tot = 0
    for i in range(len(prices)):
        tot += (list(prices.values())[i] - average) ** 2
    return tot / (len(prices) - 1)

def convert_row( row ):
    row_dict = {}
    for key, value in row.items():
        keyAscii = key.encode('ascii', 'ignore' ).decode()
        valueAscii = value.encode('ascii','ignore').decode()
        row_dict[ keyAscii ] = valueAscii
    return row_dict

main()