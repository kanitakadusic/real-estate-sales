Chart.defaults.font.size = 16;

let statistics = StatistikaNekretnina();
statistics.init(propertiesList, usersList);

let yearRanges = [];
let priceRanges = [];

function parseInput(input) {
    if (!isNaN(input) && input.trim() !== "") return Number(input);
    return input;
}

function calculateASF(button) {
    const key = String(button.parentElement.querySelector('input[name="filter-key"]').value);
    const value = parseInput(button.parentElement.querySelector('input[name="filter-value"]').value);

    const resultElement = button.parentElement.querySelector('input[name="result"]');
    const errorElement = button.parentElement.querySelector('.error-message');

    try {
        let asf = statistics.prosjecnaKvadratura({ [key]: value });

        resultElement.value = asf;
        errorElement.textContent = "";
    } catch (error) {
        resultElement.value = "";
        errorElement.textContent = error.message;
    }
}

function findOutlier(button) {
    const key = String(button.parentElement.querySelector('input[name="filter-key"]').value);
    const value = parseInput(button.parentElement.querySelector('input[name="filter-value"]').value);
    const deviation = String(button.parentElement.querySelector('input[name="deviation-key"]').value);

    const resultElement = button.parentElement.querySelector('input[name="result"]');
    const errorElement = button.parentElement.querySelector('.error-message');

    try {
        let property = statistics.outlier({ [key]: value }, deviation);

        resultElement.value = property.id;
        errorElement.textContent = "";
    } catch (error) {
        resultElement.value = "";
        errorElement.textContent = error.message;
    }
}

function addRange(button) {
    const fromElement = button.parentElement.querySelector('input[name="from"]');
    const toElement = button.parentElement.querySelector('input[name="to"]');

    const from = parseInt(fromElement.value);
    const to = parseInt(toElement.value);

    if (from <= to && from >= 0) {
        if (button.parentElement.id === "year-ranges") {
            yearRanges.push({ od: from, do: to });
            showRange("year-ranges-container", from, to);
        } else {
            priceRanges.push({ od: from, do: to });
            showRange("price-ranges-container", from, to);
        }

        fromElement.value = "";
        toElement.value = "";
    } else {
        alert("The entry is not valid.");
    }
}

function showRange(containerId, from, to) {
    let rangeElement = document.createElement("div");
    rangeElement.textContent = `${from} - ${to}`;
    rangeElement.classList.add("range");
    document.getElementById(containerId).appendChild(rangeElement);
}

function iscrtajHistogram() {
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
                            return `rgba(0, 123, 255, ${barHeight})`;
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