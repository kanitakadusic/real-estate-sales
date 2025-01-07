let statistics = StatistikaNekretnina();

PoziviAjax.getNekretnine((error, propertiesList) => {
    if (error) {
        console.error('Greška prilikom dohvatanja nekretnina sa servera:', error);
    } else {
        statistics.init(propertiesList, []);
    }
});

function parseInput(input) {
    if (!isNaN(input) && input.trim() !== "") return Number(input);
    return input;
}

function insertBlock(container, content) {
    let block = document.createElement('div');
    block.textContent = content;
    block.classList.add('block');

    container.appendChild(block);
}

function calculateASF(event) {
    event.preventDefault();
    const form = document.forms['average-square-footage'];

    const key = String(form['filter-key'].value);
    const value = parseInput(form['filter-value'].value);

    let container = form.querySelector(`#asf-container`);
    container.innerHTML = "";
    const errorElement = form.querySelector('.error-message');

    try {
        let asf = statistics.prosjecnaKvadratura({ [key]: value });
        insertBlock(container, asf)

        errorElement.textContent = "";
    } catch (error) {
        errorElement.textContent = error.message;
    }
}

function findOutlier(event) {
    event.preventDefault();
    const form = document.forms['outlier'];

    const key = String(form['filter-key'].value);
    const value = parseInput(form['filter-value'].value);
    const deviation = String(form['deviation-key'].value);

    let container = form.querySelector(`#outlier-container`);
    container.innerHTML = "";
    const errorElement = form.querySelector('.error-message');

    try {
        let outlier = statistics.outlier({ [key]: value }, deviation);
        insertBlock(
            container,
            `${outlier.naziv} [${outlier.datum_objave}] (${outlier.id})`
        )

        errorElement.textContent = "";
    } catch (error) {
        errorElement.textContent = error.message;
    }
}

function extractMy(event) {
    event.preventDefault();
    const form = document.forms['my-properties'];

    const id = parseInt(form['user-id'].value);

    let container = form.querySelector(`#my-properties-container`);
    container.innerHTML = "";
    const errorElement = form.querySelector('.error-message');

    try {
        let myProperties = statistics.mojeNekretnine({ id: id });
        myProperties.forEach(property => insertBlock(
            container,
            `${property.naziv} [${property.datum_objave}] (${property.id})`
        ));

        errorElement.textContent = "";
    } catch (error) {
        errorElement.textContent = error.message;
    }
}

let yearRanges = [];
let priceRanges = [];

function addRange(event, input) {
    event.preventDefault();
    const form = document.forms['years-prices'];

    const startElement = form[`start-${input}`];
    const endElement = form[`end-${input}`];

    const start = Number(startElement.value);
    const end = Number(endElement.value);

    if (start <= end) {
        if (input === 'year') {
            if (yearRanges.some(e => e.od === start && e.do === end)) return;
            yearRanges.push({ od: start, do: end });
        } else {
            if (priceRanges.some(e => e.od === start && e.do === end)) return;
            priceRanges.push({ od: start, do: end });
        }

        insertBlock(
            form.querySelector(`#${input}-ranges-container`),
            `${start} - ${end}`
        );

        startElement.value = "";
        endElement.value = "";
    } else {
        alert("Start must be less than or equal to End.");
    }
}

Chart.defaults.font.size = 16;

function iscrtajHistogram(event) {
    event.preventDefault();
    const histogram = statistics.histogramCijena(yearRanges, priceRanges);

    const chartsContainer = document.getElementById("charts-container");
    chartsContainer.innerHTML = "";

    const labels_PriceRanges = priceRanges.map(range => `${range.od} - ${range.do}`);

    yearRanges.forEach((range, index) => {
        const chart = document.createElement("canvas");
        chart.id = `chart-${index}`;
        chart.classList.add("chart");
        chartsContainer.appendChild(chart);

        const data_PropertyNumbers = histogram
            .slice(index * priceRanges.length, (index + 1) * priceRanges.length)
            .map(bar => bar.brojNekretnina);
        const maxBarHeight = Math.max(...data_PropertyNumbers);

        new Chart(chart, {
            type: "bar",
            data: {
                labels: labels_PriceRanges,
                datasets: [
                    {
                        label: " # of properties",
                        data: data_PropertyNumbers,
                        backgroundColor: function(context) {
                            const barHeight = context.dataset.data[context.dataIndex] / maxBarHeight || 0;
                            return `rgba(255, 153, 0, ${barHeight})`;
                        }
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Year range: ${range.od} - ${range.do}`,
                        font: {
                            size: 24
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Price ranges"
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Number of properties"
                        }
                    }
                }
            }
        });
    });
}