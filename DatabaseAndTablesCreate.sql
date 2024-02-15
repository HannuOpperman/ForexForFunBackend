CREATE DATABASE ForexForFun;

USE ForexForFun;

CREATE TABLE allComparisonCodes (
	Id INT PRIMARY KEY,
	Name VARCHAR(255),
	DecimalValue VARCHAR(25),
	Symbol VARCHAR(25) UNIQUE
);

CREATE TABLE uniqueSymbols (
	ID INT PRIMARY key AUTO_INCREMENT,
	Name VARCHAR(100) UNIQUE
);


CREATE TABLE currencyProfiles (
	Name VARCHAR(255) UNIQUE,
	Bank VARCHAR(255),
	BankNotes VARCHAR(255),
    BankNotes2 VARCHAR(255),
    CodeN VARCHAR(255),
    Coins VARCHAR(255),
    Coins2 VARCHAR(255),
    Country VARCHAR(255),
    Icon VARCHAR(255),
    ShortName VARCHAR(255),
    SubUnit VARCHAR(255),
    Symbol VARCHAR(255),
    Symbol2 VARCHAR(255),
    Type VARCHAR(255),
    Website VARCHAR(255)
);

CREATE TABLE historicExchangeRates (
	Symbol VARCHAR(25),
    Price VARCHAR(25),
    Date VARCHAR(25),
    UNIQUE KEY `dailyExchange` (`Symbol`,`Date`)
);