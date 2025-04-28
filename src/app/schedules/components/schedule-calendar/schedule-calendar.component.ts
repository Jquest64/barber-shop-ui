import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { DialogManagerService } from '../../../services/dialog-manager.service';
import { ClientScheduleAppointmentModel, SaveScheduleModel, ScheduleAppointmentMonthModel, SelectClientModel } from '../../schedule.models';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, FormsModule, NgForm } from '@angular/forms';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { YesNoDialogComponent } from '../../../commons/components/yes-no-dialog/yes-no-dialog.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-schedule-calendar',
  imports: [
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatTimepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './schedule-calendar.component.html',
  styleUrl: './schedule-calendar.component.scss',
  providers: [
    {
      provide: SERVICES_TOKEN.DIALOG, useClass: DialogManagerService
    }
  ]
})
export class ScheduleCalendarComponent implements OnInit, AfterViewInit, OnChanges {

  private subcription?: Subscription;
  private _selected: Date = new Date();
  displayedColumns: string[] = ['startAt', 'endAt', 'client', 'actions'];
  dataSource!: MatTableDataSource<ClientScheduleAppointmentModel>;
  addingSchedule: boolean = false;
  newSchedule: SaveScheduleModel = { startAt: undefined, endAt: undefined, clientId: undefined };
  clientSelectFormControl = new FormControl();
  @Input() monthSchedule!: ScheduleAppointmentMonthModel;
  @Input() clients: SelectClientModel[] = [];
  @Output() onDateChange = new EventEmitter<Date>();
  @Output() onConfirmDelete = new EventEmitter<ClientScheduleAppointmentModel>();
  @Output() onScheduleClient = new EventEmitter<SaveScheduleModel>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(@Inject(SERVICES_TOKEN.DIALOG) private readonly dialogManagerService: IDialogManagerService) { }

  get selected(): Date {
    return this._selected;
  }

  set selected(selected: Date) {
    if (this._selected.getTime() !== this._selected.getTime()) {
      this.onDateChange.emit(selected);
      this.buildTable();
      this._selected = selected;
    }
  }

  ngOnInit(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['monthSchedule'] && this.monthSchedule) {
      this.buildTable();
    }
  }

  onSubmit(form: NgForm) {
    const startAt = new Date(this.selected);
    const endAt = new Date(this.selected);

    startAt.setHours(this.newSchedule.startAt!.getHours(), this.newSchedule.startAt!.getMinutes());
    endAt.setHours(this.newSchedule.endAt!.getHours(), this.newSchedule.endAt!.getMinutes());

    const saved: ClientScheduleAppointmentModel = {
      id: -1,
      day: this._selected.getDate(),
      startAt,
      endAt,
      clientId: this.newSchedule.clientId!,
      clientName: this.clients.find(c => c.id === this.newSchedule.clientId)!.name
    }

    this.onScheduleClient.emit(saved);
    this.buildTable();
    form.resetForm();
    this.newSchedule = { startAt: undefined, endAt: undefined, clientId: undefined };
  }

  requestDelete(schedule: ClientScheduleAppointmentModel) {
    this.subcription = this.dialogManagerService.showYesNoDialog(
      YesNoDialogComponent,
      { title: 'Exclusão de agendamento', content: 'Confirma a exclusão do agendamento?' }
    ).subscribe(result => {
      if (result) {
        this.onConfirmDelete.emit(schedule);
        const updateList = this.dataSource.data.filter(c => c.id !== schedule.id);
        this.dataSource = new MatTableDataSource<ClientScheduleAppointmentModel>(updateList);

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      }
    })
  }

  onTimeChange (time: Date) {
    const endAt = new Date(time);
    endAt.setHours(time.getHours() + 1);
    this.newSchedule.endAt = endAt;
  }

  private buildTable() {
  const appointments = this.monthSchedule.scheduleAppointments.filter(a =>
    this.monthSchedule.year === this._selected.getFullYear() &&
    this.monthSchedule.month === this._selected.getMonth() &&
    a.day === this._selected.getDate()
  )

  this.dataSource = new MatTableDataSource<ClientScheduleAppointmentModel>(appointments);
  if (this.paginator) {
    this.dataSource.paginator = this.paginator;
  }
}
}
