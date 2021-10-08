import { Component, Inject, OnInit } from '@angular/core';
import { APEX_SIDE_SLIDER_DATA, NotificationService, SideSliderRef } from '@apex/apex-material';
import { ColumnApi, GridApi, GridOptions, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams, RowNode, RowSelectedEvent } from 'ag-grid-community';
import { GridResizerService } from 'src/app/shared/services/grid-resizer.service';
import { TechSpecialtyService } from 'src/app/tech-specialty/services/tech-specialty.service';

@Component({
  selector: 'app-tech-specialty-selector-slider',
  templateUrl: './tech-specialty-selector-slider.component.html',
  styleUrls: ['./tech-specialty-selector-slider.component.scss'],
  providers: [GridResizerService]
})
export class TechSpecialtySelectorSliderComponent implements OnInit {
  gridOptions: GridOptions;
  gridApi: GridApi;
  columnApi: ColumnApi;
  total = 0;
  filtersApplied = false;
  filterState = {};
  selectedTechSpecialty;
  assignedTechSpecialty;

  constructor(
    private gridResizer: GridResizerService,
    private notificationService: NotificationService,
    public sliderRef: SideSliderRef<TechSpecialtySelectorSliderComponent>,
    private techSpecialtyService: TechSpecialtyService,
    @Inject(APEX_SIDE_SLIDER_DATA) public data: any
  ) {
    this.assignedTechSpecialty = data;
  }

  ngOnInit() {
    this._setGridOptions();
  }

  onAddSelectedTechSpecialty() {
    this.sliderRef.close({
      techSpecialtyId: this.selectedTechSpecialty.techSpecialtyId,
      techSpecialtyName: this.selectedTechSpecialty.techSpecialtyName
    });
  }

  private _onRowSelection() {
    const selection = this.gridApi.getSelectedNodes();
    this.selectedTechSpecialty = (selection && selection.length > 0) ? selection[0].data : null;
  }

  private _isRowSelectable(node: RowNode) {
    return node.data && this.assignedTechSpecialty !== node.data.techSpecialtyId;
  }

  private _setGridOptions() {
    this.gridOptions = {
      rowModelType: 'serverSide',
      pagination: true,
      paginationPageSize: 25,
      cacheBlockSize: 25,
      maxBlocksInCache: 1,
      rowSelection: 'single',
      rowMultiSelectWithClick: true,
      rowDeselection: true,
      floatingFilter: true,
      suppressCellSelection: true,
      isRowSelectable: (node) => this._isRowSelectable(node),
      defaultColDef: {
        sortable: true,
        filter: 'agTextColumnFilter',
        resizable: true,
        suppressMenu: true
      },
      columnDefs: [
        {
          checkboxSelection: true,
          maxWidth: 50,
          sortable: false,
          filter: false,
          resizable: false
        },
        { field: 'techSpecialtyName', headerName: 'Name', sort: 'asc' }
      ],
      onGridReady: (params) => this._onGridReady(params),
      onRowSelected: (event) => this._onRowSelection(),
      getRowNodeId: (data) => data.techSpecialtyId
    };
  }

  private _createDataSource(): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        this.techSpecialtyService.getPagedTechSpecialty(params.request, false)
          .subscribe(
            results => {
              if (!results.total) {
                this.gridApi.showNoRowsOverlay();
              }
              this.total = results.total;
              params.successCallback(results.rowData, results.total);
            },
            error => {
              this.notificationService.showErrorSnackBar('Failed to get records.', error);
              params.failCallback();
            }
          );
      }
    };
  }

  private _onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.setServerSideDatasource(this._createDataSource());

    this.gridResizer.setGridApi(params.api);
  }

}
