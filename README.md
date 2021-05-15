# Omm Apy connector

Simple wrapper library around icon sdk and omm interfaces providing straightforward access to convenient read methods.

# Usage

## Importing library

In order to use library in your website, import index.js file from package (omm-apy-connector) in your .js file.

## Using library

Library should be used by first instantiating ```OmmApyConnector``` class, i.e. ```const ommConnector = new OmmApyConnector()```.

Using that class you can access read methods such as:
- ```getSpecificReserveData(reserve: string)``` -> returns specific ReserveData object which provides ```getSupplyApy()``` and ```getBorrowApy()```
  methods along with other properties. You can use this to get suppy and borrow APY for specific asset reserve.
- ```getAllReserveData()``` -> returns AllReservesData object containing keys USDB, ICX and USDC to access specific reserve. You can use this to
  fetch all reserves data at once and pull supply and borrow APY from each reserve.
- ```getSupplyApyForReserve(assetTag: AssetTag)``` -> returns supply APY (in decimals) for specific reserve defined by assetTag (USDB, ICX or IUSDC).
- ```getBorrowApyForReserve(assetTag: AssetTag)``` -> returns borrow APY (in decimals) for specific reserve defined by assetTag (USDB, ICX or IUSDC).
- ```getIcxBalance(address: string)``` -> get ICX balance for specific address.



**NOTE** APY-s are in decimals, to convert them to percentage multiply with 100.
