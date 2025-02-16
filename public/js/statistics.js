Chart.defaults.font.size = 16;

const yearRanges = [];
const priceRanges = [];

const statistics = StatistikaNekretnina();

ApiService.getAllProperties((error, { data: properties }) => {
    if (error) {
        console.error(error);
        statistics.init([], []);
        showErrorImage(error, document.getElementById('statistics-container'));
    } else {
        statistics.init(properties, []);
    }
});

function parseInput(input) {
    if (!isNaN(input) && input.trim() !== '') {
        return Number(input);
    }

    return input;
}

function addRange(input) {
    const form = document.forms['years-prices'];

    const startElement = form[`start-${input}`];
    const endElement = form[`end-${input}`];

    const start = Number(startElement.value);
    const end = Number(endElement.value);

    if (start <= end) {
        if (input === 'year') {
            if (yearRanges.some(e => e.start === start && e.end === end)) return;
            yearRanges.push({ start: start, end: end });
        } else if (input === 'price') {
            if (priceRanges.some(e => e.start === start && e.end === end)) return;
            priceRanges.push({ start: start, end: end });
        }

        const block = document.createElement('div');
        block.classList.add('block');
        block.textContent = `${start} - ${end}`;
        form.querySelector(`#${input}-ranges-container`).appendChild(block);

        startElement.value = '';
        endElement.value = '';
    } else {
        window.alert('Start must be less than or equal to End.');
    }
}

function displayHistogram() {
    const histogram = statistics.priceHistogram(yearRanges, priceRanges);

    const chartsContainer = document.getElementById('charts-container');
    chartsContainer.innerHTML = '';

    const labels_PriceRanges = priceRanges.map(range => `${range.start} - ${range.end}`);

    yearRanges.forEach((range, index) => {
        const chart = document.createElement('canvas');
        chart.id = `chart-${index}`;
        chart.classList.add('chart');
        chartsContainer.appendChild(chart);

        const data_PropertyNumbers = histogram
            .slice(index * priceRanges.length, (index + 1) * priceRanges.length)
            .map(bar => bar.numberOfProperties);
        const maxBarHeight = Math.max(...data_PropertyNumbers);

        new Chart(chart, {
            type: 'bar',
            data: {
                labels: labels_PriceRanges,
                datasets: [
                    {
                        label: ' # of properties',
                        data: data_PropertyNumbers,
                        backgroundColor: function (context) {
                            const barHeight = context.dataset.data[context.dataIndex] / maxBarHeight || 0;
                            return `rgba(255, 140, 0, ${barHeight})`;
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Year range: ${range.start} - ${range.end}`,
                        font: {
                            size: 20
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Price ranges'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of properties'
                        }
                    }
                }
            }
        });
    });
}

document.getElementById('asf-button').addEventListener('click', () => {
    const form = document.forms['average-square-footage'];

    const key = String(form['filter-key'].value);
    const value = parseInput(form['filter-value'].value);

    const result = form.querySelector('.result');
    result.innerHTML = '';
    
    const feedback = form.querySelector('.feedback');

    try {
        const asf = statistics.averageSquareFootage({ [key]: value });

        const block = document.createElement('div');
        block.classList.add('block');
        block.textContent = asf;
        result.appendChild(block);

        feedback.textContent = '';
    } catch (error) {
        feedback.textContent = error.message;
        feedback.style.display = 'inline-block';
    }
});

document.getElementById('outlier-button').addEventListener('click', () => {
    const form = document.forms['outlier'];

    const key = String(form['filter-key'].value);
    const value = parseInput(form['filter-value'].value);
    const deviation = String(form['deviation-key'].value);

    const result = form.querySelector('.result');
    result.innerHTML = '';

    const feedback = form.querySelector('.feedback');

    try {
        const outlier = statistics.outlier({ [key]: value }, deviation);

        const block = document.createElement('div');
        block.classList.add('block');
        const link = document.createElement('a');
        link.textContent = `${outlier.name}`;
        link.href = `/details.html?id=${encodeURIComponent(outlier.id)}`;
        block.appendChild(link);
        result.appendChild(block);

        feedback.textContent = '';
    } catch (error) {
        feedback.textContent = error.message;
        feedback.style.display = 'inline-block';
    }
});

document.getElementById('add-year-range-button').addEventListener('click', () => {
    addRange('year');
});

document.getElementById('add-price-range-button').addEventListener('click', () => {
    addRange('price');
});

document.getElementById('generate-charts-button').addEventListener('click', () => {
    displayHistogram();
});