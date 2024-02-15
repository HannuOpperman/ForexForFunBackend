const sqlService = require ('./sqlService');
const httpRequestService = require ('./httpRequestService');

const buildProfileData = async (profileQuery) => {
    await sqlService.executeQuery(profileQuery);
};

const getProfiles = async (response) => {
    let joinedSymbols = response.map(item => item.Name).join(',');
    await httpRequestService.getProfiles(joinedSymbols, buildProfileData);
};

const processNewExchangeRates = async (newExchangeRatesQuery) => {
    await sqlService.executeQuery(newExchangeRatesQuery);
};

const saveComparisonCodes = async (responseQuery) => {
    await sqlService.executeQuery(responseQuery);
};

module.exports = {
    getComparisonCodes: async () => {
        let query = 'select * from allComparisonCodes';
        return await sqlService.executeQuery(query).then((response) => {
            return response;
        });
    },
    getUniqueSymbols: async () => {
        let query = 'select * from uniqueSymbols';
        return await sqlService.executeQuery(query).then((response) => {
            return response;
        });
    },
    getCurrencyProfiles: async () => {
        let query = 'select * from currencyProfiles';
        return await sqlService.executeQuery(query).then((response) => {
            return response;
        });
    },
    buildComparisonCodes: async () => {
        await httpRequestService.getComparisonSymbols(saveComparisonCodes);
    },
    buildSymbols: async () => {
        await sqlService.buildSymbols();
    },
    getAllSymbols: async () => {
        let query = 'select * from uniqueSymbols';
        await sqlService.executeQuery(query);
    },
    getAllProfiles: async () => {
        let query = 'select * from currencyProfiles';
        await sqlService.executeQuery(query);
    },
    buildProfiles: async () => {
        await sqlService.getUniqueSymbols(getProfiles);
    },
    getHistoricValue: async ({ currencyCode, selectedDate }) => {
        // selectedDate = '2024-02-15'; // i used this command to trick the query to return values for today, if you set this value to today's date in thiis format you can test historic calls with only today's data in the db
        let query = "select * from historicExchangeRates where Symbol = '" + currencyCode + "' and Date = '" + selectedDate + "'";
        return await sqlService.executeQuery(query).then((response) => {
            return response;
        });
    },
    getNewestExchangeRates: async () => {
        return await httpRequestService.getNewestExchangeRates(processNewExchangeRates);
    }
};
