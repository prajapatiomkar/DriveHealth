import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private googleDriveService: GoogleDriveService) {}

  @Post('create-patient-file')
  async createPatientFile(@Body() patientData) {
    try {
      const selectedSheetId = patientData.selectedSheetId;
      return await this.googleDriveService.createPatientSheet(
        patientData,
        selectedSheetId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
