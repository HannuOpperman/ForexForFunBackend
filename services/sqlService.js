const mysql = require('mysql');
   
const executeQuery = async (query, optionalCallback) => {
    let promise = new Promise((resolve, reject) => {
        try {
            var connection = mysql.createConnection({
                host     : 'localhost',     // TODO for the tester, needs your credentials
                user     : 'root',          // TODO for the tester, needs your credentials
                password : 'hannupass',     // TODO for the tester, needs your credentials
                database : 'forexforfun'    // TODO for the tester, needs your credentials(but my script creates the database with this name)
            });
            connection.connect();
    
            connection.query(query, function (error, results, fields) {
                if (error) {
                    return error;
                }
                if (optionalCallback) {
                    optionalCallback(results)
                }
                resolve(results);
                return results;
            });
            connection.end();
        }
        catch (err) {
            return err;
        }
    });
    return promise;
};

const buildSymbolsWithData = async (baseComparisonList) => {
    let symbolName = '';
    let symbolList = [];
    if (baseComparisonList &&
        baseComparisonList.hasOwnProperty('length') &&
        baseComparisonList.length &&
        baseComparisonList.length > 0) {
            let queryStart = 'INSERT INTO uniqueSymbols (Name) VALUES ';
            let currentLine = '';
            for (let i = 0; i < baseComparisonList.length; i++) {
                symbolName = baseComparisonList[i].Symbol.split('/');
                if (!symbolList.includes(symbolName[0])) {
                    if (i > 0) {
                        currentLine += ', ';
                    }
                    currentLine += '(' +
                        "'" + symbolName[0] + "'" +
                        ')';
                    symbolList.push(symbolName[0]);
                }
            }
            debugger;
            let query = queryStart + currentLine;
            await executeQuery(query);

    }
    // localStorage.setItem('uniqueSymbolList', JSON.stringify(symbolList))
    // let joinedList = symbolList.join(',');
    // this.getBaseSymbols(joinedList);
};

module.exports = {
    executeQuery: executeQuery,
    async buildSymbols() {
        let query = 'select * from allComparisonCodes';
        await executeQuery(query, buildSymbolsWithData);
    },
    async getUniqueSymbols(callback) {
        let query = 'select * from uniqueSymbols';
        await executeQuery(query, callback);
    },
};