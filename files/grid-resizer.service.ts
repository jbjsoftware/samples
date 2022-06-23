import { Injectable, OnDestroy } from '@angular/core';
import { ColumnApi, GridApi, GridReadyEvent } from 'ag-grid-community';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SidenavService } from '@apex/apex-material';

@Injectable()
export class GridResizerService implements OnDestroy {
  private gridApi!: GridApi;
  private columApi!: ColumnApi;
  private unsubscribe$ = new Subject();
  private resizeType: "fit" | "auto" = 'fit';

  constructor(private sideNavService: SidenavService) { }

  init(params: GridReadyEvent, resizeType: "fit" | "auto" = 'fit') {
    this.gridApi = params.api;
    this.columApi = params.columnApi;
    this.resizeType = resizeType;
    this.enableEvents();
  }

  enableEvents() {
    this.determineResize();

    fromEvent(window, 'resize')
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(() => {
        this.determineResize();
      });

    this.sideNavService.hideNav$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        setTimeout(() => {
          this.determineResize();
        }, 300);

      });

  }

  private determineResize() {
    if (this.resizeType == 'fit') {
      this.gridApi?.sizeColumnsToFit();
    } else {
      this.columApi?.autoSizeAllColumns();
    }
  }

  ngOnDestroy() {
    this.unsubscribe$.next(null);
  }
}
