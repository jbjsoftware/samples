import { Component, Inject, ViewChild } from '@angular/core';
import { SideSliderRef, APEX_SIDE_SLIDER_DATA, NotificationService, ApexConfirmationDialogComponent } from '@apex/apex-material';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';

import { TopicsService } from '../../services/topics.service';
import { Topic } from '../../models';
import { GridAccessorService } from 'src/app/shared/services/grid-accessor.service';

@Component({
  selector: 'app-update-topic-slider',
  templateUrl: './update-topic-slider.component.html',
  styleUrls: ['./update-topic-slider.component.scss']
})
export class UpdateTopicSliderComponent {
  @ViewChild(MatTabGroup) matTab: MatTabGroup;
  details: Topic;
  selectedIndex = 0;
  stepHasPendingUpdate: boolean;

  get topicAssignmentDisabled() {
    return this.stepHasPendingUpdate;
  }

  constructor(
    public sliderRef: SideSliderRef<UpdateTopicSliderComponent>,
    @Inject(APEX_SIDE_SLIDER_DATA) public data: any,
    private topicsService: TopicsService,
    private notificationService: NotificationService,
    private gridAccessor: GridAccessorService,
    private dialog: MatDialog
  ) {
    this.details = data.item;
    this.selectedIndex = data.startIndex ?? 0;
  }

  setStepHasPendingUpdate(status: boolean) {
    this.stepHasPendingUpdate = status;
  }

  onSelectionChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  onUpdateItem(item) {
    this.topicsService.updateTopic(item)
      .subscribe(
        topic => {
          this.details = item;
          this.stepHasPendingUpdate = false;
          this.gridAccessor.purgeDataSource();
          this.notificationService.showSnackBar('Successfully updated Topic');
        },
        err => {
          this.notificationService.showErrorSnackBar('Failed to update Topic.', err);
        }
      );
  }

  onShowDeleteConfirmation() {
    const dialogRef = this.dialog.open(ApexConfirmationDialogComponent, {
      data: {
        header: `Are you sure you want to delete this topic?`,
        message: 'This is permanent and cannot be undone.'
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      confirm => {
        if (confirm) {
          this._deleteItem();
        }
      }
    );
  }

  private _deleteItem() {
    this.topicsService.deleteTopic(this.details.topicId)
      .subscribe(
        () => {
          this.gridAccessor.purgeDataSource();
          this.notificationService.showSnackBar('Successfully deleted Topic');
          this.sliderRef.close();
        },
        err => {
          this.notificationService.showErrorSnackBar('Failed to delete Topic.', err);
        }
      );
  }
}

