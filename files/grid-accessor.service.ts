import { Injectable } from '@angular/core';
import { GridApi, ColumnApi, IServerSideDatasource, GridReadyEvent } from 'ag-grid-community';

@Injectable()
export class GridAccessorService {
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  private dataSource: IServerSideDatasource;

  constructor() { }

  setDataSource(dataSource: IServerSideDatasource) {
    this.dataSource = dataSource;
    this.createDataSource();
  }

  createDataSource() {
    if (this.gridApi) {
      this.gridApi.setServerSideDatasource(this.dataSource);
    }
  }

  purgeDataSource() {
    this.gridApi.purgeServerSideCache();
  }

  initGrid(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

}
