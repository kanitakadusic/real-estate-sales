const PoziviAjax = (() => {
    
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

    function userLogin(username, password, fnCallback) {
        const url = '/login';
        const data = {
            username,
            password
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }
    
    function userLogout(fnCallback) {
        const url = '/logout';

        ajaxRequest('POST', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getLoggedInUser(fnCallback) {
        const url = '/user';
    
        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function updateLoggedInUser(updatedUser, fnCallback) {
        const url = '/user';
    
        ajaxRequest('PUT', url, updatedUser, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getAllProperties(fnCallback) {
        const url = `/properties`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getTopPropertiesByLocation(location, fnCallback) {
        const url = `/properties/top?location=${encodeURIComponent(location)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getPropertyById(id, fnCallback) {
        const url = `/properties/${encodeURIComponent(id)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getPropertyInterests(id, fnCallback) {
        const url = `/properties/${encodeURIComponent(id)}/interests`;
        
        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getUserQueries(fnCallback) {
        const url = '/user/queries';

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function createPropertyQuery(propertyId, text, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/query`;
        const data = {
            text
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function getPropertyQueriesPaged(propertyId, page, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/queries?page=${encodeURIComponent(page)}`;

        ajaxRequest('GET', url, null, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    } 

    function createPropertyRequest(propertyId, text, requestedDate, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/request`;
        const data = {
            text,
            requestedDate
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function updateRequestStatusByAdmin(propertyId, requestId, isApproved, textAddition, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/requests/${encodeURIComponent(requestId)}`;
        const data = {
            isApproved,
            textAddition
        };
        
        ajaxRequest('PUT', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
    }

    function createPropertyOffer(propertyId, text, price, isRejected, parentId, fnCallback) {
        const url = `/properties/${encodeURIComponent(propertyId)}/offer`;
        const data = {
            text,
            price,
            isRejected,
            parentId
        };
    
        ajaxRequest('POST', url, data, (error, response) => {
            if (error) {
                fnCallback(error.statusText, null);
            } else {
                try {
                    fnCallback(null, JSON.parse(response));
                } catch (parseError) {
                    fnCallback(parseError.message, null);
                }
            }
        });
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