/**
 * Backend API Katalog Toko
 * Google Apps Script untuk integrasi Google Sheets ke Web Frontend
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // 1. Ambil data tab Pengaturan
    var settingsSheet = ss.getSheetByName('Pengaturan');
    var storeData = {};
    
    if (settingsSheet) {
      var settingsValues = settingsSheet.getDataRange().getValues();
      for (var i = 0; i < settingsValues.length; i++) {
        var key = String(settingsValues[i][0]).trim();
        var val = settingsValues[i][1];
        if (key !== '') {
          storeData[key] = val;
        }
      }
    }

    // 2. Ambil data tab Produk
    var productsSheet = ss.getSheetByName('Produk');
    var productList = [];

    if (productsSheet) {
      var productValues = productsSheet.getDataRange().getValues();
      
      if (productValues.length > 1) {
        var headers = productValues[0].map(function(h) {
          return String(h).trim().toLowerCase();
        });

        for (var row = 1; row < productValues.length; row++) {
          var currentRow = productValues[row];
          var productObj = {};
          var isEmptyRow = true;

          for (var col = 0; col < headers.length; col++) {
            var headerName = headers[col];
            var cellValue = currentRow[col];

            if (cellValue !== '' && cellValue !== null && cellValue !== undefined) {
              isEmptyRow = false;
            }
            productObj[headerName] = cellValue;
          }

          // Lewati baris kosong
          if (isEmptyRow) {
            continue;
          }

          // Filter hanya produk yang statusnya aktif
          var status = String(productObj['status'] || '').trim().toLowerCase();
          if (status === 'aktif' || status === '') {
            // Pastikan harga berupa angka numerik
            if (productObj['harga'] !== undefined) {
              var cleanPrice = Number(String(productObj['harga']).replace(/[^0-9.-]+/g, ''));
              productObj['harga'] = isNaN(cleanPrice) ? 0 : cleanPrice;
            }
            productList.push(productObj);
          }
        }
      }
    }

    var result = {
      status: 'success',
      store: storeData,
      products: productList,
      timestamp: new Date().toISOString()
    };

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    var errorResult = {
      status: 'error',
      message: err.toString()
    };

    return ContentService.createTextOutput(JSON.stringify(errorResult))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}
