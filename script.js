async function fetchHistoricalPrice(date) {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${formattedDate}`);
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const data = await response.json();
    return data.market_data.current_price.usd;
}

async function calculateBitcoin() {
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
    const startDate = new Date(document.getElementById('start-date').value);
    const currency = document.getElementById('currency').value;
    const currencySymbols = {
        'USD': '$',
        'GBP': '£',
        'EUR': '€'
    };
    const bitcoinSymbol = '₿';

    if (isNaN(monthlyContribution) || isNaN(startDate.getTime()) || monthlyContribution <= 0) {
        document.getElementById('result').innerText = "Please enter valid values.";
        return;
    }

    const currentDate = new Date();
    const totalMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    const totalSpent = monthlyContribution * totalMonths;

    let totalBitcoin = 0;

    // Loop through each month from the start date to the end date
    let dateIterator = new Date(startDate);
    while (dateIterator <= currentDate) {
        try {
            const price = await fetchHistoricalPrice(dateIterator);
            const monthlySpend = monthlyContribution / price;
            totalBitcoin += monthlySpend;
            console.log(`Date: ${dateIterator.toISOString().split('T')[0]}, Price: ${price}, Bitcoin Bought: ${monthlySpend}, Total Bitcoin: ${totalBitcoin}`); // Debugging
        } catch (error) {
            console.error('Error fetching historical Bitcoin prices:', error);
            document.getElementById('result').innerText = "Error fetching Bitcoin prices.";
            return;
        }
        // Move to the next month
        dateIterator.setMonth(dateIterator.getMonth() + 1);
    }

    const lastPrice = await fetchHistoricalPrice(currentDate);
    const totalValue = totalBitcoin * lastPrice;

    document.getElementById('result').innerHTML = `
        You spent this much on your pension: ${currencySymbols[currency]}${totalSpent.toLocaleString()}<br>
        If you invested it in ${bitcoinSymbol}: ${totalBitcoin.toFixed(6)} ${bitcoinSymbol} worth approximately ${currencySymbols[currency]}${totalValue.toLocaleString()} today.
    `;
}
