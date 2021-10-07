import { Component, OnInit, Input, Inject, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { GridOptions, GridApi, ColumnApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams, RowNode } from 'ag-grid-community';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '@apex/apex-material';

import { GridResizerService } from 'src/app/shared/services/grid-resizer.service';
import { QuestionsService } from 'src/app/questions/services/questions.service';
import { Question } from 'src/app/questions/models';
import { AvailableQuestionForAssignmentSelectorCellRendererComponent } from '../../ag-components';
import { QuestionAnswerCellRendererComponent } from 'src/app/shared/ag-components/cell-renderers';
import { LocaleDateTimePipe } from 'src/app/shared/pipes/locale-date-time.pipe';

@Component({
  selector: 'app-available-questions-for-assignment',
  templateUrl: './available-questions-for-assignment.component.html',
  styleUrls: ['./available-questions-for-assignment.component.scss'],
  providers: [GridResizerService, LocaleDateTimePipe]
})
export class AvailableQuestionsForAssignmentComponent implements OnInit, OnDestroy, OnChanges {
  private unsubscribe$ = new Subject();
  @Input() assignedQuestions: Question[];
  @Output() emitAssignQuestions = new EventEmitter();
  gridOptions: GridOptions;
  gridApi: GridApi;
  columnApi: ColumnApi;
  selectedQuestions = [];
  total: number;

  constructor(
    @Inject(MatTabGroup) private tabGroup: MatTabGroup,
    private gridResizer: GridResizerService,
    private questionsService: QuestionsService,
    private notificationService: NotificationService,
    private localDateTime: LocaleDateTimePipe
  ) { }

  ngOnInit() {
    this._setGridOptions();

    if (this.tabGroup) {
      this.tabGroup.animationDone
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(
          () => {
            if (this.gridApi && this.tabGroup.selectedIndex === 1) {
              this.gridApi.sizeColumnsToFit();
            }
          }
        );
    }

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.assignedQuestions && this.gridApi) {
      this.gridApi.purgeServerSideCache();
    }
  }

  onAssignQuestions() {
    this.emitAssignQuestions.emit(this.selectedQuestions);
    this.gridApi.deselectAll();
  }

  private _createDataSource(): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {
        this.questionsService.getPagedQuestions(params.request, false)
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

  private _setGridOptions() {
    this.gridOptions = {
      frameworkComponents: {
        questionSelector: AvailableQuestionForAssignmentSelectorCellRendererComponent,
        answerRenderer: QuestionAnswerCellRendererComponent
      },
      rowModelType: 'serverSide',
      pagination: true,
      paginationPageSize: 25,
      cacheBlockSize: 25,
      maxBlocksInCache: 1,
      rowSelection: 'multiple',
      enableRangeSelection: true,
      suppressRowClickSelection: true,
      rowMultiSelectWithClick: false,
      rowDeselection: true,
      floatingFilter: true,
      isRowSelectable: (node: RowNode) => {
        return !this.assignedQuestions.find(x => node.data && x.questionId === node.data.questionId);
      },
      defaultColDef: {
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: { defaultOption: 'contains' },
        resizable: true
      },
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelection: false,
          headerCheckboxSelectionFilteredOnly: true,
          field: '',
          headerName: '',
          suppressSizeToFit: true,
          minWidth: 100,
          maxWidth: 100,
          filter: false,
          sortable: false,
          suppressMenu: true,
          suppressMovable: true,
          resizable: false,
          lockVisible: true,
          pinned: 'left',
          cellRenderer: 'questionSelector',
          cellRendererParams: () => {
            return {
              assignedQuestions: this.assignedQuestions
            };
          },
          onCellClicked: (params) => {
            if (params.node.parent.selectable) {
              params.node.setSelected(!params.node.isSelected());
            }
          }
        },
        { field: 'questionText', headerName: 'Question' },
        {
          field: 'answerText',
          headerName: 'Answer',
          cellRenderer: 'answerRenderer',
          sortable: false,
          cellRendererParams: (params) => {
            return {
              questionText: params.data.questionText,
              answerText: params.data.answerText
            };
          }
        },
        {
          field: 'lastUpdatedDate',
          headerName: 'Last Updated',
          filter: false,
          maxWidth: 160,
          minWidth: 150,
          sort: 'desc',
          cellRenderer: (params) => {
            return this.localDateTime.transform(params.value);
          },
        },
        {
          field: 'lastUpdatedByFullName',
          headerName: 'Last Updated By',
          filter: 'agTextColumnFilter',
          hide: true,
          maxWidth: 200,
          minWidth: 200,
        },
      ],
      onFilterChanged: () => {
        this.gridApi.deselectAll();
        this.selectedQuestions = [];
      },
      onSortChanged: () => {
        this.gridApi.deselectAll();
        this.selectedQuestions = [];
      },
      onGridReady: (params) => this._onGridReady(params),
      onRowSelected: (event: any) => {
        if (event.node && event.node.selected) {
          this.selectedQuestions.push(event.data);
        }
        else {
          this.selectedQuestions = this.selectedQuestions.filter(x => x !== event.data);
        }
      }
    };
  }

  private _onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridResizer.setGridApi(params.api);
    this.gridApi.setServerSideDatasource(this._createDataSource());
  }

}
