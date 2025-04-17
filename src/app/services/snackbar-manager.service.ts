import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ISnackbarManagerService } from './isnackbar-manager.service';


@Injectable({
  providedIn: 'root'
})
export class SnackbarManagerService implements ISnackbarManagerService {

  constructor(private readonly snackBar: MatSnackBar) { }

  show(message: string, action: string = 'fechar', duration: number = 3000): void {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
