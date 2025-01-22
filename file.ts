import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    // inne importy
    ReactiveFormsModule
  ],
  // deklaracje, bootstrap itp.
})
export class AppModule { }

interface Answer {
  text: string;
  nextQuestionId?: number;
}

interface Question {
  id: number;
  text: string;
  answers: Answer[];
}

const questions: Question[] = [
  {
    id: 1,
    text: 'Jakie jest Twoje ulubione zwierzę?',
    answers: [
      { text: 'Pies', nextQuestionId: 2 },
      { text: 'Kot', nextQuestionId: 3 },
      { text: 'Inne', nextQuestionId: 4 }
    ]
  },
  {
    id: 2,
    text: 'Dlaczego lubisz psy?',
    answers: [
      { text: 'Są lojalne' },
      { text: 'Są aktywne' }
    ]
  },
  // kolejne pytania
];

import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html'
})
export class QuestionnaireComponent {
  questionnaireForm: FormGroup;
  currentQuestion: Question;
  questions = questions; // zaimportuj lub zdefiniuj pytania

  constructor(private fb: FormBuilder) {
    this.questionnaireForm = this.fb.group({
      answer: ['']
    });
    this.currentQuestion = this.questions[0]; // rozpocznij od pierwszego pytania
  }

  onAnswerSelect(answer: Answer) {
    const nextQuestionId = answer.nextQuestionId;
    if (nextQuestionId) {
      this.currentQuestion = this.questions.find(q => q.id === nextQuestionId);
      this.questionnaireForm.reset();
    } else {
      // zakończ kwestionariusz lub wykonaj inne akcje
    }
  }
}


<form [formGroup]="questionnaireForm" (ngSubmit)="onAnswerSelect(questionnaireForm.value.answer)">
  <div *ngIf="currentQuestion">
    <p>{{ currentQuestion.text }}</p>
    <div *ngFor="let answer of currentQuestion.answers">
      <input
        type="radio"
        [value]="answer"
        formControlName="answer"
        (change)="onAnswerSelect(answer)"
      />
      {{ answer.text }}
    </div>
  </div>
</form>