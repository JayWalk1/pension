function calculateBitcoin() {
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

    // Fetch historical Bitcoin prices and calculate accumulated Bitcoin
    fetch(`https://api.coindesk.com/v1/bpi/historical/close.json?currency=${currency}&start=${startDate.toISOString().split('T')[0]}&end=${currentDate.toISOString().split('T')[0]}`)
        .then(response => response.json())
        .then(data => {
            const prices = data.bpi;
            let totalBitcoin = 0;
            const monthlySpend = monthlyContribution;

            // Loop through each month from the start date to the end date
            let dateIterator = new Date(startDate);
            while (dateIterator <= currentDate) {
                let dateString = dateIterator.toISOString().split('T')[0];
                if (prices[dateString]) {
                    totalBitcoin += monthlySpend / prices[dateString];
                }
                // Move to the next month
                dateIterator.setMonth(dateIterator.getMonth() + 1);
            }

            const lastDate = Object.keys(prices).pop();
            const lastPrice = prices[lastDate];
            const totalValue = totalBitcoin * lastPrice;

            document.getElementById('result').innerHTML = `
                You spent this much on your pension: ${currencySymbols[currency]}${totalSpent.toLocaleString()}<br>
                If you invested it in ${bitcoinSymbol}: ${totalBitcoin.toFixed(6)} ${bitcoinSymbol} worth approximately ${currencySymbols[currency]}${totalValue.toLocaleString()} today.
            `;
        })
        .catch(error => {
            console.error('Error fetching historical Bitcoin prices:', error);
            document.getElementById('result').innerT
