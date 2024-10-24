import pandas as pd
import json

# Define thresholds and probability of failure
thresholds = {
    "Engine Oil Pressure": {"Low": 25, "High": 65, "Probability": "High"},
    "Engine Speed": {"High": 1800, "Probability": "Medium"},
    "Engine Temperature": {"High": 105, "Probability": "High"},
    "Brake Control": {"Low": 1, "Probability": "Medium"},
    "Transmission Pressure": {"Low": 200, "High": 450, "Probability": "Medium"},
    "Pedal Sensor": {"High": 4.7, "Probability": "Low"},
    "Water Fuel": {"High": 1800, "Probability": "High"},
    "Fuel Level": {"Low": 1, "Probability": "Low"},
    "Fuel Pressure": {"Low": 35, "High": 65, "Probability": "Low"},
    "Fuel Temperature": {"High": 400, "Probability": "High"},
    "System Voltage": {"Low": 12.0, "High": 15.0, "Probability": "High"},
    "Exhaust Gas Temperature": {"High": 365, "Probability": "High"},
    "Hydraulic Pump Rate": {"High": 125, "Probability": "Medium"},
    "Air Filter Pressure Drop": {"Low": 20, "Probability": "Medium"}
}

# Function to evaluate each parameter
def evaluate_parameter(parameter, value):
    threshold = thresholds.get(parameter)
    if not threshold:
        return "Normal"

    risk = "Normal"

    if "Low" in threshold and value < threshold["Low"]:
        risk = threshold["Probability"]
    if "High" in threshold and value > threshold["High"]:
        risk = threshold["Probability"]

    return risk

def process_file(file_path):
    # Read the CSV file
    df = pd.read_csv(file_path)
    # Calculate the failure risk
    df['Failure_Risk'] = df.apply(lambda row: evaluate_parameter(row['Parameter'], row['Value']), axis=1)

    # Categorize the results
    high_risk_df = df[df['Failure_Risk'] == 'High']
    medium_risk_df = df[df['Failure_Risk'] == 'Medium']
    low_risk_df = df[df['Failure_Risk'] == 'Low']

    # Convert to a dictionary format
    return {
        "highRisk": high_risk_df.to_dict(orient="records"),
        "mediumRisk": medium_risk_df.to_dict(orient="records"),
        "lowRisk": low_risk_df.to_dict(orient="records")
    }

if __name__ == "__main__":
    import sys
    # Get the file path from the command line argument
    file_path = sys.argv[1]
    # Process the file
    results = process_file(file_path)
    # Print the results as a JSON string
    print(json.dumps({"formatted_output": results}))  # Convert to JSON with formatted output
