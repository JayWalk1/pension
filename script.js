document.getElementById('investment-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const initialAmount = parseFloat(document.getElementById('initial-amount').value);
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);

    if (isNaN(initialAmount) || initialAmount <= 0) {
        alert('Please enter a valid initial investment amount.');
        return;
    }
    
    if (startDate >= endDate) {
        alert('End date must be later than start date.');
        return;
    }

    // Average annual return rate for UK pensions (fixed assumption)
    const pensionAnnualReturnRate = 0.06;

    calculatePensionGrowth(initialAmount, startDate, endDate, pensionAnnualReturnRate);
    fetchBitcoinData(initialAmount, startDate, endDate);
});

function calculatePensionGrowth(initialAmount, startDate, endDate, annualReturnRate) {
    const years = (endDate - startDate) / (1000 * 60 * 60 * 24 * 365.25);
    const finalAmount = initialAmount * Math.pow(1 + annualReturnRate, years);

    document.getElementById('pension-result').textContent = `Final value in UK pension: £${finalAmount.toFixed(2)}`;
}

function fetchBitcoinData(initialAmount, startDate, endDate) {
    const startTimestamp = Math.floor(startDate.getTime() / 1000);
    const endTimestamp = Math.floor(endDate.getTime() / 1000);

    const url = `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=gbp&from=${startTimestamp}&to=${endTimestamp}`;

    fetch(url)
        .then(response => response.json())
        .then(data => calculateBitcoinGrowth(initialAmount, data.prices, startDate, endDate))
        .catch(error => {
            console.error('Error fetching Bitcoin data:', error);
            alert('Failed to fetch Bitcoin data. Please try again later.');
        });
}

function calculateBitcoinGrowth(initialAmount, prices, startDate, endDate) {
    const startPrice = prices[0][1];
    const endPrice = prices[prices.length - 1][1];

    const growthFactor = endPrice / startPrice;
    const finalAmount = initialAmount * growthFactor;

    document.getElementById('bitcoin-result').textContent = `Final value in Bitcoin: £${finalAmount.toFixed(2)}`;

    compareInvestments(finalAmount, startDate, endDate);
}

function compareInvestments(bitcoinFinalAmount, startDate, endDate) {
    const pensionResultText = document.getElementById('pension-result').textContent;
    const pensionFinalAmount = parseFloat(pensionResultText.match(/£([\d,.]+)/)[1].replace(/,/g, ''));

    let comparisonSummary;

    if (bitcoinFinalAmount > pensionFinalAmount) {
        comparisonSummary = `Bitcoin outperformed the UK pension by £${(bitcoinFinalAmount - pensionFinalAmount).toFixed(2)} over the given period.`;
    } else if (bitcoinFinalAmount < pensionFinalAmount) {
        comparisonSummary = `The UK pension outperformed Bitcoin by £${(pensionFinalAmount - bitcoinFinalAmount).toFixed(2)} over the given period.`;
    } else {
        comparisonSummary = 'Both investments performed equally over the given period.';
    }

    document.getElementById('comparison-summary').textContent = comparisonSummary;
}
