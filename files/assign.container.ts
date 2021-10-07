import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SideSlider } from '@apex/apex-material';

import * as fromStore from '../../store';
import { TopicQuestion, Topic } from 'src/app/topics/models';
import { AddTopicQuestionSliderComponent } from '../add-topic-question-slider/add-topic-question-slider.component';
import { UpdateTopicQuestionSliderComponent } from '../update-topic-question-slider/update-topic-question-slider.component';

@Component({
  selector: 'app-assign-topic-questions-container',
  templateUrl: './assign-topic-questions-container.component.html',
  styleUrls: ['./assign-topic-questions-container.component.scss']
})
export class AssignTopicQuestionsContainerComponent implements OnInit {
  @Input() details: Topic;
  assignedQuestions$: Observable<TopicQuestion[]>;

  constructor(
    private store: Store<fromStore.State>,
    private slider: SideSlider,
  ) { }

  ngOnInit(): void {
    this.assignedQuestions$ = this.store.select(fromStore.selectTopicQuestions);

    this.store.dispatch(fromStore.TopicQuestionsActions.loadTopicQuestions({ id: this.details.topicId }));
  }

  onAssignQuestions(questions: TopicQuestion[]) {
    this.store.dispatch(fromStore.TopicQuestionsActions.assignQuestionsToTopic({
      topicId: this.details.topicId,
      questionIds: questions.map(x => x.questionId)
    }));
  }

  onUnassignQuestions(questions: TopicQuestion[]) {
    this.store.dispatch(fromStore.TopicQuestionsActions.unassignQuestionsToTopic({
      topicId: this.details.topicId,
      questionIds: questions.map(x => x.questionId)
    }));
  }

  onReorderQuestions(questions: TopicQuestion[]) {
    this.store.dispatch(fromStore.TopicQuestionsActions.reorderTopicQuestions({
      topicId: this.details.topicId,
      questionIds: questions.map(x => x.questionId)
    }));
  }

  onAddNewQuestion() {
    const sliderRef = this.slider.open(AddTopicQuestionSliderComponent, {
      width: '900px',
      disableClose: false
    });

    sliderRef.beforeClosed()
      .subscribe(
        data => {
          if (data) {
            this.store.dispatch(fromStore.TopicQuestionsActions.addQuestionToTopic({
              topicId: this.details.topicId,
              questionId: data.questionId
            }));
          }
        }
      );
  }

  onUpdateQuestion(topicQuestion: TopicQuestion) {
    const sliderRef = this.slider.open(UpdateTopicQuestionSliderComponent, {
      width: '900px',
      disableClose: false,
      data: { question: topicQuestion.question, topicId: this.details.topicId }
    });

    sliderRef.beforeClosed()
      .subscribe(
        data => {
          if (data) {
            this.store.dispatch(fromStore.TopicQuestionsActions.updateTopicQuestion({
              update: {
                id: topicQuestion.questionId,
                changes: { question: { ...topicQuestion.question, ...data } }
              }
            }));
          }
        }
      );
  }

}
