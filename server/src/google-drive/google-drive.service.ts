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
      } else {
        sheetIdToUse = await this.createNewGoogleSheet();
        this.logger.log(`Created new sheet ID: ${sheetIdToUse}`);
      }

      const sheets = await this.getSheetsInstance();

      await this.ensureSheetExists(sheets, sheetIdToUse, 'Patient', [
        'patientId',
        'patientName',
        'location',
        'age',
        'gender',
        'phone',
        'address',
      ]);
      await this.ensureSheetExists(sheets, sheetIdToUse, 'Prescription', [
        'prescription',
        'dose',
        'visitDate',
        'nextVisit',
      ]);
      await this.ensureSheetExists(sheets, sheetIdToUse, 'Physician', [
        'physicianId',
        'physicianName',
        'physicianNumber',
        'bill',
      ]);

      const patientSheetValues = [
        patientData.patientId,
        patientData.patientName,
        patientData.location,
        patientData.age,
        patientData.gender,
        patientData.phone,
        patientData.address,
      ];
      const prescriptionSheetValues = [
        patientData.prescription,
        patientData.dose,
        patientData.visitDate,
        patientData.nextVisit,
      ];
      const physicianSheetValues = [
        patientData.physicianId,
        patientData.physicianName,
        patientData.physicianNumber,
        patientData.bill,
      ];

      await this.appendOrUpdateRow(
        sheets,
        sheetIdToUse,
        'Patient',
        patientSheetValues,
      );
      await this.appendOrUpdateRow(
        sheets,
        sheetIdToUse,
        'Prescription',
        prescriptionSheetValues,
      );
      await this.appendOrUpdateRow(
        sheets,
        sheetIdToUse,
        'Physician',
        physicianSheetValues,
      );

      return {
        message: '✅ Patient data appended to sheets',
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
          title: 'Patient Data Sheet',
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
}
