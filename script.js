function doGet(e) {
  const nameToCheck = (e.parameter.name || "").trim().toLowerCase();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getRange("A2:B" + sheet.getLastRow()).getValues();

  for (let i = 0; i < data.length; i++) {
    const fullName = (data[i][0] || "").toLowerCase().trim();
    if (fullName === nameToCheck) {
      return ContentService.createTextOutput(JSON.stringify({
        status: "found",
        response: data[i][1] || ""
      })).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "not_found"
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    const data = JSON.parse(e.postData.contents);

    const nameToCheck = (data.name || "").trim().toLowerCase();
    const response = data.response || "";

    const names = sheet.getRange("A2:A" + sheet.getLastRow()).getValues();

    for (let i = 0; i < names.length; i++) {
      const fullName = (names[i][0] || "").toLowerCase().trim();
      if (fullName === nameToCheck) {
        sheet.getRange(i + 2, 2).setValue(response); // Row offset
        return ContentService.createTextOutput(JSON.stringify({
          status: "updated",
          name: fullName,
          response: response
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "not_found"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.message
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
