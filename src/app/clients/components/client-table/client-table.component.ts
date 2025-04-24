import { AfterViewInit, Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ClientModelTable } from '../../client.models';
import { Subscription } from 'rxjs';
import { IDialogManagerService } from '../../../services/idialog-manager.service';
import { SERVICES_TOKEN } from '../../../services/service.token';
import { DialogManagerService } from '../../../services/dialog-manager.service';

@Component({
  selector: 'app-client-table',
  imports: [
    MatTableModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './client-table.component.html',
  styleUrl: './client-table.component.scss',
  standalone: true,
  providers: [{ provide: SERVICES_TOKEN.DIALOG, useClass: DialogManagerService }] 
})
export class ClientTableComponent implements AfterViewInit, OnChanges, OnDestroy {

  @Input() clients: ClientModelTable[] = [];
  dataSource!: MatTableDataSource<ClientModelTable>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = ['name', 'email', 'phone', 'actions'];
  private dialogManagerServiceSubscriptions?: Subscription;
  @Output() comfirmDelete = new EventEmitter<ClientModelTable>();
  @Output() requestUpdate = new EventEmitter<ClientModelTable>();

  constructor(
    @Inject('SERVICES_TOKEN.DIALOG') private readonly dialogManagerService: IDialogManagerService
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    if (changes[ 'clients' ] && this.clients) {
      this.dataSource = new MatTableDataSource<ClientModelTable>(this.clients);
      
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    }
  }

  ngOnDestroy(): void {

    if (this.dialogManagerServiceSubscriptions) {
      this.dialogManagerServiceSubscriptions.unsubscribe();
    }
  }

  formatPhone(phone: string) {
    return `(${phone.substring(0, 2)}) ${phone.substring(2, 7)}-${phone.substring(7)}`;
  }
}
