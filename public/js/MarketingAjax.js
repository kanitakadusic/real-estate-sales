const MarketingAjax = (() => {

    function ajaxRequest(method, url, data, callback) {
        const ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    callback(null, ajax.responseText);
                } else {
                    callback({ status: ajax.status, statusText: ajax.statusText }, null);
                }
            }
        };

        ajax.open(method, url, true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(data ? JSON.stringify(data) : null);
    }

    function updateDivElements(newPreferenceList, preferenceType) {
        if (
            newPreferenceList && 
            newPreferenceList.preferenceList && 
            Array.isArray(newPreferenceList.preferenceList)
        ) {
            newPreferenceList.preferenceList.forEach(preference => {
                const spanElement = document.getElementById(`${preferenceType}-${preference.id}`);

                if (spanElement) {
                    spanElement.textContent = `Total ${preferenceType}: ${preference[preferenceType] || 0}`;
                }
            });
        } else {
            console.error('Neispravan format odgovora');
        }
    }

    let Global_PropertyIDsList_Searches = [-1];
    let Global_PropertyIDsList_Clicks = [-1];

    function impl_osvjeziPretrage(propertiesContainer) {
        let propertyIDsList = [];

        propertiesContainer.querySelectorAll('[id^="searches-"]').forEach((span) => {
            const id = span.id.replace('searches-', '');
            propertyIDsList.push(parseInt(id, 10));
        });

        if (Global_PropertyIDsList_Searches.includes(-1)) {
            Global_PropertyIDsList_Searches = propertyIDsList;
        } else {
            propertyIDsList = propertyIDsList.filter(e => !Global_PropertyIDsList_Searches.includes(e));
        }

        const url = '/marketing/osvjezi/pretrage';
        const data = {
            propertyIDsList: propertyIDsList
        };

        ajaxRequest('POST', url, data, (error, response) => {
            if (!error) {
                updateDivElements(JSON.parse(response), 'searches');
            }
        });
    }

    function impl_osvjeziKlikove(propertiesContainer) {
        let propertyIDsList = [];

        propertiesContainer.querySelectorAll('[id^="clicks-"]').forEach((span) => {
            const id = span.id.replace('clicks-', '');
            propertyIDsList.push(parseInt(id, 10));
        });

        if (Global_PropertyIDsList_Clicks.includes(-1)) {
            Global_PropertyIDsList_Clicks = propertyIDsList;
        } else {
            propertyIDsList = propertyIDsList.filter(e => !Global_PropertyIDsList_Clicks.includes(e));
        }

        const url = '/marketing/osvjezi/klikovi';
        const data = {
            propertyIDsList: propertyIDsList
        };

        ajaxRequest('POST', url, data, (error, response) => {
            if (!error) {
                updateDivElements(JSON.parse(response), 'clicks');
            }
        });
    }

    function impl_novoFiltriranje(filteredPropertyIDsList) {
        console.log(filteredPropertyIDsList);
        Global_PropertyIDsList_Searches = [-1];

        const url = '/marketing/nekretnine';
        const data = {
            propertyIDsList: filteredPropertyIDsList
        };

        ajaxRequest('POST', url, data, (error, response) => {});
    }
    
    function impl_klikNekretnina(propertyId) {
        Global_PropertyIDsList_Clicks = [`${propertyId}`];
        const propertyElement = document.getElementById(`${propertyId}`);

        if (propertyElement) {
            const url = `/marketing/nekretnina/${encodeURIComponent(propertyId)}`;
    
            ajaxRequest('POST', url, null, (error, response) => {
                if (error) {
                    console.error('Greška prilikom slanja zahtjeva:', error);
                } else {
                    console.log('Zahtjev uspješno poslan:', response);
                }
            });
        }
    }
    
    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje,
        klikNekretnina: impl_klikNekretnina,
    };
})();