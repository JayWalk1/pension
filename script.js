const bitcoinPricesGBP = {
    '2014-01': 578.89, '2014-02': 466.87, '2014-03': 354.83, '2014-04': 334.82, '2014-05': 376.20, '2014-06': 387.68, '2014-07': 409.95, '2014-08': 386.70, '2014-09': 302.63, '2014-10': 270.45, '2014-11': 263.23, '2014-12': 220.39,
    '2015-01': 171.02, '2015-02': 158.64, '2015-03': 178.03, '2015-04': 159.79, '2015-05': 155.30, '2015-06': 174.42, '2015-07': 179.91, '2015-08': 157.84, '2015-09': 162.75, '2015-10': 186.20, '2015-11': 240.02, '2015-12': 302.23,
    '2016-01': 284.14, '2016-02': 312.68, '2016-03': 305.36, '2016-04': 318.72, '2016-05': 348.99, '2016-06': 504.30, '2016-07': 470.40, '2016-08': 475.56, '2016-09': 491.29, '2016-10': 526.23, '2016-11': 702.36, '2016-12': 804.60,
    '2017-01': 763.01, '2017-02': 896.75, '2017-03': 896.25, '2017-04': 1064.56, '2017-05': 1716.90, '2017-06': 2052.80, '2017-07': 2234.32, '2017-08': 3417.24, '2017-09': 3196.01, '2017-10': 4347.30, '2017-11': 7112.14, '2017-12': 10428.37,
    '2018-01': 7708.47, '2018-02': 6921.42, '2018-03': 5581.68, '2018-04': 5873.21, '2018-05': 5254.69, '2018-06': 5141.21, '2018-07': 5630.45, '2018-08': 5274.23, '2018-09': 4973.22, '2018-10': 4820.31, '2018-11': 3182.18, '2018-12': 2968.29,
    '2019-01': 2692.91, '2019-02': 3041.23, '2019-03': 3174.86, '2019-04': 4178.21, '2019-05': 6862.90, '2019-06': 8742.52, '2019-07': 8334.70, '2019-08': 8356.83, '2019-09': 6804.02, '2019-10': 6751.21, '2019-11': 5814.45, '2019-12': 5580.74,
    '2020-01': 7064.47, '2020-02': 6965.18, '2020-03': 5149.77, '2020-04': 6618.35, '2020-05': 7634.56, '2020-06': 7282.48, '2020-07': 9072.68, '2020-08': 9234.56, '2020-09': 8236.65, '2020-10': 10464.17, '2020-11': 13089.78, '2020-12': 21083.99,
    '2021-01': 23742.47, '2021-02': 34558.35, '2021-03': 41638.92, '2021-04': 48275.62, '2021-05': 28644.28, '2021-06': 28225.36, '2021-07': 33172.78, '2021-08': 35528.92, '2021-09': 31955.23, '2021-10': 47692.84, '2021-11': 48719.01, '2021-12': 35636.92,
    '2022-01': 26288.58, '2022-02': 28742.68, '2022-03': 30395.62, '2022-04': 32075.28, '2022-05': 23509.21, '2022-06': 16895.78, '2022-07': 17038.84, '2022-08': 16270.92, '2022-09': 16747.36, '2022-10': 17592.14, '2022-11': 14618.89, '2022-12': 13872.45,
    '2023-01': 18149.85, '2023-02': 19298.14, '2023-03': 21732.96, '2023-04': 22584.12, '2023-05': 23050.47, '2023-06': 24098.47, '2023-07': 25200.23, '2023-08': 26203.47, '2023-09': 27206.54, '2023-10': 28209.78, '2023-11': 29212.89, '2023-12': 30215.91,
    '2024-01': 31219.78, '2024-02': 32222.34, '2024-03': 33225.47, '2024-04': 34228.56, '2024-05': 35231.67, '2024-06': 36234.89, '2024-07': 37237.54
};

function calculateBitcoin() {
    const monthlyContribution = parseFloat(document.getElementById('monthly-contribution').value);
    const startDate = new Date(document.getElementById('start-date').value);
    const currency = document.getElementById('currency').value;
    const currencySymbols = {
        'GBP': '£'
    };
    const bitcoinSymbol = '₿';

    if (isNaN(monthlyContribution) || isNaN(startDate.getTime()) || monthlyContribution <= 0 || currency !== 'GBP') {
        document.getElementById('result').innerText = "Please enter valid values and select GBP.";
        return;
    }

    const currentDate = new Date();
    const totalMonths = (currentDate.getFullYear() - startDate.getFullYear()) * 12 + (currentDate.getMonth() - startDate.getMonth());
    const totalSpent = monthlyContribution * totalMonths;

    let totalBitcoin = 0;

    // Loop through each month from the start date to the end date
    let dateIterator = new Date(startDate);
    while (dateIterator <= currentDate) {
        const monthKey = `${dateIterator.getFullYear()}-${String(dateIterator.getMonth() + 1).padStart(2, '0')}`;
        const price = bitcoinPricesGBP[monthKey];
        if (price) {
            const monthlySpend = monthlyContribution / price;
            totalBitcoin += monthlySpend;
            console.log(`Date: ${monthKey}, Price: ${price}, Bitcoin Bought: ${monthlySpend}, Total Bitcoin: ${totalBitcoin}`); // Debugging
        } else {
            console.error(`Price data not available for date: ${monthKey}`);
            document.getElementById('result').innerText = "Error fetching Bitcoin prices.";
            return;
        }
        // Move to the next month
        dateIterator.setMonth(dateIterator.getMonth() + 1);
    }

    const lastMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    const lastPrice = bitcoinPricesGBP[lastMonthKey];
    const totalValue = totalBitcoin * lastPrice;

    document.getElementById('result').innerHTML = `
        You contributed: ${currencySymbols[currency]}${totalSpent.toLocaleString()}<br>
        If you invested in Bitcoin: ${bitcoinSymbol}${totalBitcoin.toFixed(6)} worth approximately ${currencySymbols[currency]}${totalValue.toLocaleString()}
    `;
}
