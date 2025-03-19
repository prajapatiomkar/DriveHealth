import { Controller, Post, Body, Get, Param, Query, Put } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Post('create-patient-file')
  async createPatientFile(@Body() patientData: any) {
    return this.googleDriveService.createPatientSheet(patientData);
  }
  @Get('patients')
  async getPatients(@Query('selectedSheetId') selectedSheetId: string) {
    return this.googleDriveService.getAllPatients(selectedSheetId);
  }
  @Get('patient/:patientId')
  async getPatient(
    @Param('patientId') patientId: string,
    @Query('selectedSheetId') selectedSheetId: string,
  ) {
    return this.googleDriveService.getPatientData(patientId, selectedSheetId);
  }

  @Put('patient/:patientId')
  async updatePatient(
    @Param('patientId') patientId: string,
    @Body() patientData: any,
    @Query('selectedSheetId') selectedSheetId: string,
  ) {
    console.log(selectedSheetId, 'selectedSheetId');
    return this.googleDriveService.updatePatientData(
      patientId,
      patientData,
      selectedSheetId,
    );
  }
}
