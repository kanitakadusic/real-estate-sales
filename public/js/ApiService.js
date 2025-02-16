const ApiService = (() => {
    function ajaxRequest(method, url, data, callback) {
        const ajax = new XMLHttpRequest();

        ajax.onreadystatechange = () => {
            if (ajax.readyState === 4) {
                try {
                    const response = JSON.parse(ajax.responseText);

                    if (ajax.status >= 200 && ajax.status <= 299) {
                        callback(null, {
                            message: response.message,
                            data: response.data
                        });
                    } else {
                        callback({
                            message: response.message || 'There was an issue processing the request. Please try again later.',
                            statusCode: ajax.status,
                            statusText: ajax.statusText
                        }, {});
                    }
                } catch (error) {
                    callback({ message: 'There was an issue processing the request. Please try again later.' }, {});
                }
            }
        };

        ajax.onerror = () => {
            callback({ message: 'It seems there is a problem with the network. Please check your connection and retry.' }, {});
        };        

        ajax.open(method, url, true);
        ajax.setRequestHeader('Content-Type', 'application/json');
        ajax.send(data ? JSON.stringify(data) : null);
    }

    function userLogin(username, password, fnCallback) {
        const url = '/login';
        const data = {
            username,
            password
        };
    
        ajaxRequest('POST', url, data, fnCallback);
    }
    
    function userLogout(fnCallback) {
        const url = '/logout';

        ajaxRequest('POST', url, null, fnCallback);
    }

    function getLoggedInUser(fnCallback) {
        const url = '/user';
    
        ajaxRequest('GET', url, null, fnCallback);
    }

    function updateLoggedInUser(updatedUser, fnCallback) {
        const url = '/user';
    
        ajaxRequest('PUT', url, updatedUser, fnCallback);
    }

    function getAllProperties(fnCallback) {
        const url = `/properties`;

        ajaxRequest('GET', url, null, fnCallback);
    }

    function getTopPropertiesByLocation(location, fnCallback) {
        const url = `/properties/top?location=${encodeURIComponent(location)}`;

        ajaxRequest('GET', url, null, fnCallback);
    }

    function getPropertyById(id, fnCallback) {
        const url = `/properties/${encodeURIComponent(id)}`;

        ajaxRequest('GET', url, null, fnCallback);
    }

    function getPropertyInterests(id, fnCallback) {
        const url = `/properties/${encodeURIComponent(id)}/interests`;
        
        ajaxRequest('GET', url, null, fnCallback);
    }

    function getUserQueries(fnCallback) {
        const url = '/user/queries';

        ajaxRequest('GET', url, null, fnCallback);
    }

    function createPropertyQuery(propertyId, text, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/query`;
        const data = {
            text
        };
    
        ajaxRequest('POST', url, data, fnCallback);
    }

    function getPropertyQueriesPaged(propertyId, page, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/queries?page=${encodeURIComponent(page)}`;

        ajaxRequest('GET', url, null, fnCallback);
    } 

    function createPropertyRequest(propertyId, text, requestedDate, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/request`;
        const data = {
            text,
            requestedDate
        };
    
        ajaxRequest('POST', url, data, fnCallback);
    }

    function updateRequestStatusByAdmin(propertyId, requestId, isApproved, textAddition, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/requests/${encodeURIComponent(requestId)}`;
        const data = {
            isApproved,
            textAddition
        };
        
        ajaxRequest('PUT', url, data, fnCallback);
    }

    function createPropertyOffer(propertyId, text, price, isRejected, parentId, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/offer`;
        const data = {
            text,
            price,
            isRejected,
            parentId
        };
    
        ajaxRequest('POST', url, data, fnCallback);
    }

    return {
        userLogin,
        userLogout,
        getLoggedInUser,
        updateLoggedInUser,
        getAllProperties,
        getTopPropertiesByLocation,
        getPropertyById,
        getPropertyInterests,
        getUserQueries,
        createPropertyQuery,
        getPropertyQueriesPaged,
        createPropertyRequest,
        updateRequestStatusByAdmin,
        createPropertyOffer
    };
})();