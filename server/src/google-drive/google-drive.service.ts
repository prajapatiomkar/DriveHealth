import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleDriveService {
  private readonly logger = new Logger(GoogleDriveService.name);
  private readonly serviceAccountKey;

  constructor(private configService: ConfigService) {
    this.serviceAccountKey = JSON.parse(
      this.configService.get<string>('GOOGLE_SERVICE_ACCOUNT_KEY'),
    );
  }

  async createPatientSheet(patientData, selectedSheetId?: string) {
    let sheetIdToUse: string;

    try {
      if (selectedSheetId) {
        sheetIdToUse = selectedSheetId;
        this.logger.log(`Using selected sheet ID: ${sheetIdToUse}`);
      }

      const sheets = await this.getSheetsInstance();

      // Ensure the single sheet exists with combined headers
      await this.ensureSheetExists(sheets, sheetIdToUse, 'PatientData', [
        'patientId',
        'patientName',
        'location',
        'age',
        'gender',
        'phone',
        'address',
        'prescription',
        'dose',
        'visitDate',
        'nextVisit',
        'physicianId',
        'physicianName',
        'physicianNumber',
        'bill',
      ]);

      const combinedData = [
        patientData.patientId,
        patientData.patientName,
        patientData.location,
        patientData.age,
        patientData.gender,
        patientData.phone,
        patientData.address,
        patientData.prescription,
        patientData.dose,
        patientData.visitDate,
        patientData.nextVisit,
        patientData.physicianId,
        patientData.physicianName,
        patientData.physicianNumber,
        patientData.bill,
      ];

      await this.appendOrUpdateRow(
        sheets,
        sheetIdToUse,
        'PatientData',
        combinedData,
      );

      return {
        message: '✅ Patient data appended to sheet',
        sheetId: sheetIdToUse,
      };
    } catch (error) {
      this.logger.error(
        `Error creating/appending data: ${error.message}`,
        error.stack,
      );
      this.logger.error(`Full error object: ${JSON.stringify(error)}`);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async createNewGoogleSheet(): Promise<string> {
    const sheets = await this.getSheetsInstance();

    const response = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: 'Combined Patient Data',
        },
      },
    });

    return response.data.spreadsheetId;
  }

  private async ensureSheetExists(
    sheets: any,
    spreadsheetId: string,
    sheetName: string,
    headers?: string[],
  ) {
    const sheetMetadata = await sheets.spreadsheets.get({
      spreadsheetId: spreadsheetId,
    });

    const existingSheet = sheetMetadata.data.sheets.find(
      (sheet) => sheet.properties.title === sheetName,
    );

    if (!existingSheet) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });
      this.logger.log(`Created sheet: ${sheetName}`);
      if (headers && headers.length > 0) {
        await this.setHeaderRow(sheets, spreadsheetId, sheetName, headers);
        this.logger.log(`Added header row to sheet: ${sheetName}`);
      }
    }
  }

  private async setHeaderRow(
    sheets: any,
    spreadsheetId: string,
    sheetName: string,
    headers: string[],
  ) {
    const range = `${sheetName}!A1:${String.fromCharCode(
      64 + headers.length,
    )}1`;
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });
  }

  private async appendOrUpdateRow(
    sheets: any,
    spreadsheetId: string,
    sheetName: string,
    values: any[],
  ) {
    try {
      const range = `${sheetName}!A:A`;
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: spreadsheetId,
        range: range,
      });

      const existingRows = response.data.values || [];
      const patientId = values[0];

      let rowIndex = -1;
      for (let i = 0; i < existingRows.length; i++) {
        if (existingRows[i][0] === patientId) {
          rowIndex = i + 1;
          break;
        }
      }

      const updateRange =
        rowIndex > 0
          ? `${sheetName}!A${rowIndex}:${String.fromCharCode(64 + values.length)}${rowIndex}`
          : `${sheetName}!A${existingRows.length + 1}:${String.fromCharCode(64 + values.length)}${existingRows.length + 1}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });

      this.logger.log(
        rowIndex > 0
          ? `Updated row with patientId: ${patientId} in sheet: ${sheetName}`
          : `Appended new row with patientId: ${patientId} to sheet: ${sheetName}`,
      );
    } catch (error) {
      this.logger.error(`Full error object: ${JSON.stringify(error)}`);
      this.logger.error(
        `Error editing/appending row in ${sheetName}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async getSheetsInstance() {
    const auth = new JWT({
      email: this.serviceAccountKey.client_email,
      key: this.serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    await auth.authorize();
    return google.sheets({ version: 'v4', auth });
  }
  async getAllPatients(selectedSheetId: string) {
    const sheets = await this.getSheetsInstance();

    try {
      const range = 'PatientData'; // Get all data from the PatientData sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: selectedSheetId,
        range: range,
      });

      const values = response.data.values || [];
      const headers = values[0] || [];
      const patientData = [];

      for (let i = 1; i < values.length; i++) {
        const patient = {};
        for (let j = 0; j < headers.length; j++) {
          patient[headers[j]] = values[i][j];
        }
        patientData.push(patient);
      }

      return patientData;
    } catch (error) {
      this.logger.error(
        `Error getting all patients: ${error.message}`,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async getPatientData(patientId: string, selectedSheetId: string) {
    const sheets = await this.getSheetsInstance();

    try {
      const range = 'PatientData!A:A';
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: selectedSheetId,
        range: range,
      });

      const existingRows = response.data.values || [];
      let rowIndex = -1;

      for (let i = 0; i < existingRows.length; i++) {
        if (existingRows[i][0] === patientId) {
          rowIndex = i + 1;
          break;
        }
      }

      if (rowIndex === -1) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      const rowRange = `PatientData!A${rowIndex}:${String.fromCharCode(
        64 + 15, // Assuming 15 columns
      )}${rowIndex}`;

      console.log('Row Range: ', rowRange);

      const rowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: selectedSheetId,
        range: rowRange,
      });

      const patientData = rowResponse.data.values[0];

      console.log('Patient Data: ', patientData);

      return {
        patientId: patientData[0],
        patientName: patientData[1],
        location: patientData[2],
        age: patientData[3],
        gender: patientData[4],
        phone: patientData[5],
        address: patientData[6],
        prescription: patientData[7],
        dose: patientData[8],
        visitDate: patientData[9],
        nextVisit: patientData[10],
        physicianId: patientData[11],
        physicianName: patientData[12],
        physicianNumber: patientData[13],
        bill: patientData[14],
      };
    } catch (error) {
      this.logger.error(
        `Error getting patient data: ${error.message}`,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePatientData(
    patientId: string,
    patientData: any,
    selectedSheetId: string,
  ) {
    const sheets = await this.getSheetsInstance();

    try {
      const range = 'PatientData!A:A'; // Assuming patientId is in column A
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: selectedSheetId,
        range: range,
      });

      const existingRows = response.data.values || [];
      let rowIndex = -1;

      for (let i = 0; i < existingRows.length; i++) {
        if (existingRows[i][0] === patientId) {
          rowIndex = i + 1; // Row index is 1-based
          break;
        }
      }

      if (rowIndex === -1) {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }

      const updateRange = `PatientData!A${rowIndex}:${String.fromCharCode(
        64 + Object.values(patientData).length,
      )}${rowIndex}`;

      const updatedValues = [
        patientData.patientName,
        patientData.location,
        patientData.age,
        patientData.gender,
        patientData.phone,
        patientData.address,
        patientData.prescription,
        patientData.dose,
        patientData.visitDate,
        patientData.nextVisit,
        patientData.physicianName,
        patientData.physicianNumber,
        patientData.bill,
      ];
      updatedValues.unshift(patientId);

      await sheets.spreadsheets.values.update({
        spreadsheetId: selectedSheetId,
        range: updateRange,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [updatedValues],
        },
      });

      return { message: 'Patient data updated successfully' };
    } catch (error) {
      this.logger.error(
        `Error updating patient data: ${error.message}`,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async searchPatientById(patientId: string, selectedSheetId: string) {
    const sheets = await this.getSheetsInstance();

    try {
      const range = 'PatientData!A:A'; // Assuming patientId is in column A
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: selectedSheetId,
        range: range,
      });

      const existingRows = response.data.values || [];
      let rowIndex = -1;

      for (let i = 0; i < existingRows.length; i++) {
        if (existingRows[i][0] === patientId) {
          rowIndex = i + 1; // Row index is 1-based
          break;
        }
      }

      if (rowIndex === -1) {
        return []; // Return empty array if patient not found
      }

      const rowRange = `PatientData!A${rowIndex}:${String.fromCharCode(
        64 + 15, // Assuming 15 columns
      )}${rowIndex}`;

      const rowResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: selectedSheetId,
        range: rowRange,
      });

      const patientData = rowResponse.data.values[0];

      return [
        {
          patientId: patientData[0],
          patientName: patientData[1],
          location: patientData[2],
          age: patientData[3],
          gender: patientData[4],
          phone: patientData[5],
          address: patientData[6],
          prescription: patientData[7],
          dose: patientData[8],
          visitDate: patientData[9],
          nextVisit: patientData[10],
          physicianId: patientData[11],
          physicianName: patientData[12],
          physicianNumber: patientData[13],
          bill: patientData[14],
        },
      ];
    } catch (error) {
      this.logger.error(
        `Error searching patient by ID: ${error.message}`,
        error.stack,
      );
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
