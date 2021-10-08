// :host {
//     display: flex;
//     height: 100%;
//     justify-content: space-around;
//   }
  
//   div {
//     flex: 1 0 0px;
//   }
  
//   button {
//     height: 100%;
//     width: 100%;
//     min-width: 0;
//     padding: 0;
  
//     &:focus {
//       box-shadow: none;
//     }
//   }

// <div matTooltip='EDIT ITEM'>
//   <button mat-button (click)='editItem($event)'>
//     <mat-icon>edit</mat-icon>
//   </button>
// </div>

// <div *ngIf='params?.data?.active' matTooltip='DEACTIVATE ITEM'>
//   <button mat-button (click)='showDeactivateConfirmation($event)' class='text-success'>
//     <mat-icon>toggle_off</mat-icon>
//   </button>
// </div>

// <div *ngIf='!params?.data?.active' matTooltip='ACTIVATE ITEM'>
//   <button mat-button (click)='showActivateConfirmation($event)' color='warn'>
//     <mat-icon>toggle_on</mat-icon>
//   </button>
// </div>

  

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApexConfirmationDialogComponent } from '@apex/apex-material';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-actions-cell-renderer',
  templateUrl: './actions-cell-renderer.component.html',
  styleUrls: ['./actions-cell-renderer.component.scss']
})
export class ActionsCellRendererComponent implements ICellRendererAngularComp {
  params;

  constructor(private dialog: MatDialog) { }

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  editItem(event) {
    event.stopPropagation();

    this.params.onEditItem(this.params.data);
  }

  showDeleteConfirmation(event) {

    event.stopPropagation();

    const dialogRef = this.dialog.open(ApexConfirmationDialogComponent, {
      data: {
        header: `Are you sure you want to delete this ${(this.params.entity ?? 'item')}?`
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.params.onConfirmDelete(this.params.data);
        }
      }
    );
  }

  showActivateConfirmation(event) {

    event.stopPropagation();

    const dialogRef = this.dialog.open(ApexConfirmationDialogComponent, {
      data: {
        confirmText: 'Activate',
        header: `Are you sure you want to activate this ${(this.params.entity ?? 'item')}?`
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.params.onConfirmActivate(this.params.data);
        }
      }
    );
  }

  showDeactivateConfirmation(event) {

    event.stopPropagation();

    const dialogRef = this.dialog.open(ApexConfirmationDialogComponent, {
      data: {
        confirmText: 'Deactivate',
        header: `Are you sure you want to deactivate this ${(this.params.entity ?? 'item')}?`
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this.params.onConfirmDeativate(this.params.data);
        }
      }
    );
  }

}
