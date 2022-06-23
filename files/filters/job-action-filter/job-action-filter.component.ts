import { Component } from '@angular/core';
import { IFloatingFilter } from 'ag-grid-community';

@Component({
  selector: 'app-job-action-filter',
  templateUrl: './job-action-filter.component.html',
  styleUrls: ['./job-action-filter.component.scss']
})
export class JobActionFilterComponent implements IFloatingFilter {
  params: any;
  currentValue: any;

  constructor() { }

  agInit(params: any): void {
    this.params = params;
  }

  valueChanged() {
    const valueToUse = this.currentValue ? this.currentValue : null;
    this.params.parentFilterInstance((instance: any) => {
      instance.onFloatingFilterChanged(
        'equals',
        valueToUse
      );
    });
  }

  onParentModelChanged(parentModel: any): void {
    if (parentModel == null) {
      this.currentValue = null;
    } else {
      this.currentValue = parentModel.filter;
    }
  }
}
