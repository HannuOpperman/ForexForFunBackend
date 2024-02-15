const apiKey = 'K9izZeK9cwB2rKS86EalHszK';
const baseUrl = 'https://fcsapi.com/api-v3/forex/';
const forexListUrl = 'list?type=forex';
const currencyListUrl = 'profile?symbol=';
const currencyConversionUrl = 'converter?';
const currencyPriceUrl = 'latest?symbol=';
const historicPriceUrl = 'history?symbol=';
const accessKeySuffix = '&access_key=' + apiKey;

const request = require('request');
const moment = require('moment');

module.exports = {
    async getComparisonSymbols(callback) {
        let connectionUrl = baseUrl + forexListUrl + accessKeySuffix;
        let responseBody;
        request({
            method: 'GET',
            uri: connectionUrl
        }, (error, response, body) => {
            if (error) {
                return error;
            }
            if (body) {
                responseBody = JSON.parse(body); 
            }
            if (responseBody &&
                responseBody.hasOwnProperty('code') &&
                responseBody.code === 200) {
                if (responseBody.hasOwnProperty('response') &&
                    responseBody.response &&
                    responseBody.response.hasOwnProperty('length') &&
                    responseBody.response.length > 0) {
                        return callback(this.buildComparisonQuery(responseBody.response));
                }
            }
            else {
                console.log(response, responseBody);
            }
        })
    },

    buildComparisonQuery(symbolList) {
        if (symbolList &&
            symbolList.hasOwnProperty('length') &&
            symbolList.length &&
            symbolList.length > 0) {
            let queryStart = 'INSERT INTO allComparisonCodes (Id, Name, DecimalValue, Symbol) VALUES ';
            let currentLine = '';
            for (let i = 0; i < symbolList.length; i++) {
                if (i > 0) {
                    currentLine += ', ';
                }
                currentLine += '(' +
                    symbolList[i].id + ", " +
                    "'" + symbolList[i].name + "', " +
                    "'" + symbolList[i].decimal + "', " +
                    "'" + symbolList[i].symbol + "'" +
                    ')';
            }
            let query = queryStart + currentLine;
            return query;
        }
    },

    buildProfilesQuery(profileList, symbolList) {
        if (profileList &&
            profileList.hasOwnProperty('length') &&
            profileList.length &&
            profileList.length > 0) {
            let queryStart = 'INSERT INTO currencyProfiles ' +
                            '(Name, Bank, BankNotes, BankNotes2, CodeN, Coins, Coins2, Country, Icon, ShortName, SubUnit, Symbol, Symbol2, Type, Website) VALUES ';
            let currentLine = '';
            for (let i = 0; i < profileList.length; i++) {
                if (symbolList.includes(profileList[i].short_name) && profileList[i].type === 'forex') {
                    if (i > 0) {
                        currentLine += ', ';
                    }
                    currentLine += '(' +
                    // profileList[i].Id + ", " +
                        "'" + profileList[i].name + "', " +
                        '"' + profileList[i].bank + '", ' +
                        "'" + profileList[i].banknotes + "', " +
                        "'" + profileList[i].banknotes_2 + "', " +
                        "'" + profileList[i].code_n + "', " +
                        "'" + profileList[i].coins + "', " +
                        "'" + profileList[i].coins_2 + "', " +
                        "'" + profileList[i].country + "', " +
                        "'" + profileList[i].icon + "', " +
                        "'" + profileList[i].short_name + "', " +
                        "'" + profileList[i].subunit + "', " +
                        "'" + profileList[i].symbol + "', " +
                        "'" + profileList[i].symbol_2 + "', " +
                        "'" + profileList[i].type + "', " +
                        "'" + profileList[i].website + "'" +
                        ')';
                }
            }
            let query = queryStart + currentLine;
            debugger;
            return query;
        }
    },

    buildNewExchangeRatesQuery(exchangeList) {
        if (exchangeList &&
            exchangeList.hasOwnProperty('length') &&
            exchangeList.length &&
            exchangeList.length > 0) {
            let queryStart = 'INSERT INTO historicExchangeRates (Symbol, Price, Date) VALUES ';
            let currentLine = '';
            let today = moment().format('yyyy-MM-DD');
            let symbolList = [];
            for (let i = 0; i < exchangeList.length; i++) {
                if (!symbolList.includes(exchangeList[i].s)) {
                    if (i > 0) {
                        currentLine += ', ';
                    }
                    currentLine += '(' +
                        "'" + exchangeList[i].s + "', " +
                        "'" + exchangeList[i].c + "', " +
                        "'" + today + "'" +
                        ')';
                        symbolList.push(exchangeList[i].s);
                }
            }
            let query = queryStart + currentLine;
            return query;
        }
    },

    async getProfiles(symbolList, callback) {
        if (symbolList &&
            symbolList.hasOwnProperty('length') &&
            symbolList.length &&
            symbolList.length > 0) {
            let responseBody = '';
            let connectionUrl = baseUrl + currencyListUrl + symbolList + accessKeySuffix;
            request({
                method: 'GET',
                uri: connectionUrl
            }, (error, response, body) => {
                // console.log(error, response, body);
                if (error) {
                    return error;
                }
                if (body) {
                    responseBody = JSON.parse(body); 
                }
                if (responseBody &&
                    responseBody.hasOwnProperty('code') &&
                    responseBody.code === 200) {
                    if (responseBody.hasOwnProperty('response') &&
                        responseBody.response &&
                        responseBody.response.hasOwnProperty('length') &&
                        responseBody.response.length > 0) {
                        return callback(this.buildProfilesQuery(responseBody.response, symbolList.split(',')));
                    }
                }
                else {
                    console.log(response, responseBody);
                }
            })
        }
    },

    async getNewestExchangeRates(callback) {
        let connectionUrl = baseUrl + currencyPriceUrl + 'all_forex' + accessKeySuffix;
        let responseBody;
        request({
            method: 'GET',
            uri: connectionUrl
        }, (error, response, body) => {
            // console.log(error, response, body);
            if (error) {
                return error;
            }
            if (body) {
                responseBody = JSON.parse(body); 
            }
            if (responseBody &&
                responseBody.hasOwnProperty('code') &&
                responseBody.code === 200) {
                if (responseBody.hasOwnProperty('response') &&
                    responseBody.response &&
                    responseBody.response.hasOwnProperty('length') &&
                    responseBody.response.length > 0) {
                        return callback(this.buildNewExchangeRatesQuery(responseBody.response));
                }
            }
            else {
                console.log(response, responseBody);
            }
        })
    },
}