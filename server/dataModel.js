const pandas = require('pandas-js');
const thresholds = {
    "Engine Oil Pressure": {"Low": 25, "High": 65, "Probability": "High"},
    "Engine Speed": {"High": 1800, "Probability": "Medium"},
    // ... other thresholds
};

function evaluate_parameter(parameter, value) {
    const threshold = thresholds[parameter];
    if (!threshold) return "Normal";
    
    let risk = "Normal";
    if ("Low" in threshold && value < threshold["Low"]) {
        risk = threshold["Probability"];
    }
    if ("High" in threshold && value > threshold["High"]) {
        risk = threshold["Probability"];
    }
    return risk;
}

function processFile(filePath) {
    const df1 = pandas.readCSV(filePath);
    df1['Failure_Risk'] = df1.apply(row => evaluate_parameter(row['Parameter'], row['Value']));
    
    const high_risk_df = df1.filter(row => row['Failure_Risk'] === 'High');
    const medium_risk_df = df1.filter(row => row['Failure_Risk'] === 'Medium');
    const low_risk_df = df1.filter(row => row['Failure_Risk'] === 'Low');
    
    return {
        highRisk: high_risk_df,
        mediumRisk: medium_risk_df,
        lowRisk: low_risk_df,
    };
}

module.exports = processFile;
