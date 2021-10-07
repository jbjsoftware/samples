import { Component, OnInit, Input, Inject, OnDestroy, Output, EventEmitter } from '@angular/core';
import { GridOptions, GridApi, ColumnApi, GridReadyEvent, RowDragEvent } from 'ag-grid-community';
import { MatTabGroup } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GridResizerService } from 'src/app/shared/services/grid-resizer.service';
import { QuestionAnswerCellRendererComponent, ApprovedRendererComponent, EditRowRendererComponent } from 'src/app/shared/ag-components/cell-renderers';

@Component({
  selector: 'app-assigned-questions',
  templateUrl: './assigned-questions.component.html',
  styleUrls: ['./assigned-questions.component.scss'],
  providers: [GridResizerService]
})
export class AssignedQuestionsComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  @Input() rowData = [];
  @Output() emitUnassignQuestions = new EventEmitter();
  @Output() emitReorderQuestions = new EventEmitter();
  @Output() emitAddQuestion = new EventEmitter();
  @Output() emitUpdateQuestion = new EventEmitter();
  gridOptions: GridOptions;
  gridApi: GridApi;
  columnApi: ColumnApi;
  selectedQuestions = [];

  constructor(
    @Inject(MatTabGroup) private tabGroup: MatTabGroup,
    private gridResizer: GridResizerService
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

  onUnassignQuestions() {
    this.emitUnassignQuestions.emit(this.selectedQuestions);
    this.gridApi.deselectAll();
  }

  private _onRowReorder(event: RowDragEvent) {
    const gridData = [];
    this.gridApi.forEachNode(node => {
      gridData.push(node.data);
    });

    this.emitReorderQuestions.emit(gridData);
  }

  private _setGridOptions() {
    this.gridOptions = {
      frameworkComponents: {
        answerRenderer: QuestionAnswerCellRendererComponent,
        approvedRenderer: ApprovedRendererComponent,
        editRenderer: EditRowRendererComponent
      },
      rowSelection: 'multiple',
      suppressRowClickSelection: true,
      rowMultiSelectWithClick: false,
      rowDeselection: true,
      floatingFilter: true,
      rowDragManaged: true,
      defaultColDef: {
        sortable: true,
        filter: 'agTextColumnFilter',
        filterParams: { defaultOption: 'contains' },
        resizable: true
      },
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          field: '',
          headerName: '',
          suppressSizeToFit: true,
          minWidth: 50,
          maxWidth: 50,
          filter: false,
          sortable: false,
          suppressMenu: true,
          suppressMovable: true,
          resizable: false,
          lockVisible: true,
          pinned: 'left',
          onCellClicked: (params) => {
            if (params.node.parent.selectable) {
              params.node.setSelected(!params.node.isSelected());
            }
          }
        },
        {
          field: '',
          headerClass: 'cursor-default  pl-4 border-left',
          cellClass: 'p-0 border-left',
          resizable: false,
          sortable: false,
          filter: false,
          suppressMovable: true,
          suppressAutoSize: true,
          suppressSizeToFit: true,
          suppressMenu: true,
          minWidth: 70,
          maxWidth: 70,
          pinned: 'left',
          cellRenderer: 'editRenderer',
          cellRendererParams: (params) => {
            return {
              onEditItem: (data) => this.emitUpdateQuestion.emit(data)
            };
          }
        },
        {
          field: 'question.questionText',
          headerName: 'Question',
          rowDrag: true,
        },
        {
          field: 'question.answerText',
          headerName: 'Answer',
          cellRenderer: 'answerRenderer',
          cellRendererParams: (params) => {
            return {
              questionText: params.data.question.questionText,
              answerText: params.data.question.answerText
            };
          }
        },
        {
          field: 'question.approved',
          headerName: 'Approved',
          cellRenderer: 'approvedRenderer',
          maxWidth: 128,
          minWidth: 128,
          filter: false
        },
      ],
      onGridReady: (params) => this._onGridReady(params),
      onRowSelected: (event: any) => {
        if (event.node && event.node.selected) {
          this.selectedQuestions.push(event.data);
        }
        else {
          this.selectedQuestions = this.selectedQuestions.filter(x => x !== event.data);
        }
      },
      onRowDragEnd: (event) => this._onRowReorder(event)
    };
  }

  private _onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridResizer.setGridApi(params.api);
  }

}
