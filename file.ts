export interface Question {
  id: string;
  text: string;
  answers: Answer[];
  selectedAnswer?: string; // Wybrana odpowiedź użytkownika
}

export interface Answer {
  text: string;
  nextQuestionId?: string; // Kolejne pytanie, które ma się pojawić
}

const QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Jakie jest Twoje ulubione jedzenie?',
    answers: [
      { text: 'Pizza', nextQuestionId: 'q2' },
      { text: 'Sałatka', nextQuestionId: 'q3' },
    ],
  },
  {
    id: 'q2',
    text: 'Wolisz włoską czy amerykańską pizzę?',
    answers: [
      { text: 'Włoska', nextQuestionId: 'q4' },
      { text: 'Amerykańska', nextQuestionId: 'q5' },
    ],
  },
  {
    id: 'q3',
    text: 'Wolisz sałatki owocowe czy warzywne?',
    answers: [
      { text: 'Owocowe', nextQuestionId: 'q4' },
      { text: 'Warzywne', nextQuestionId: 'q5' },
    ],
  },
];

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question } from './models/question.model';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private questions = QUESTIONS;
  private visibleQuestions: Question[] = [];
  private visibleQuestionsSubject = new BehaviorSubject<Question[]>([]);
  visibleQuestions$ = this.visibleQuestionsSubject.asObservable();

  constructor() {
    // Dodaj pierwsze pytanie do widocznych
    this.visibleQuestions = [this.questions[0]];
    this.updateVisibleQuestions();
  }

  answerQuestion(questionId: string, selectedAnswer: string) {
    const question = this.questions.find((q) => q.id === questionId);
    if (question) {
      question.selectedAnswer = selectedAnswer;

      // Sprawdź, czy kolejne pytanie jest już widoczne
      const nextQuestionId = question.answers.find((a) => a.text === selectedAnswer)?.nextQuestionId;
      const nextQuestion = this.questions.find((q) => q.id === nextQuestionId);

      if (nextQuestion && !this.visibleQuestions.includes(nextQuestion)) {
        this.visibleQuestions.push(nextQuestion);
      }

      this.updateVisibleQuestions();
    }
  }

  updateAnswer(questionId: string, newAnswer: string) {
    this.answerQuestion(questionId, newAnswer); // Po prostu zmień odpowiedź
  }

  private updateVisibleQuestions() {
    this.visibleQuestionsSubject.next([...this.visibleQuestions]);
  }
}


import { Component } from '@angular/core';
import { QuestionnaireService } from './questionnaire.service';
import { Question } from './models/question.model';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
})
export class QuestionnaireComponent {
  visibleQuestions: Question[] = [];

  constructor(private questionnaireService: QuestionnaireService) {
    this.questionnaireService.visibleQuestions$.subscribe((questions) => {
      this.visibleQuestions = questions;
    });
  }

  onAnswerSelected(questionId: string, selectedAnswer: string) {
    this.questionnaireService.answerQuestion(questionId, selectedAnswer);
  }

  onChangeAnswer(questionId: string, selectedAnswer: string) {
    this.questionnaireService.updateAnswer(questionId, selectedAnswer);
  }
}


<div *ngFor="let question of visibleQuestions; let i = index">
  <div>
    <h2>{{ question.text }}</h2>
    <ng-container *ngIf="!question.selectedAnswer || i === visibleQuestions.length - 1; else answeredTemplate">
      <ul>
        <li *ngFor="let answer of question.answers">
          <button (click)="onAnswerSelected(question.id, answer.text)">
            {{ answer.text }}
          </button>
        </li>
      </ul>
    </ng-container>
    <ng-template #answeredTemplate>
      <p>Wybrano: {{ question.selectedAnswer }}</p>
      <button *ngFor="let answer of question.answers" (click)="onChangeAnswer(question.id, answer.text)">
        Zmień na: {{ answer.text }}
      </button>
    </ng-template>
  </div>
</div>


.current-question {
  font-weight: bold;
  border: 2px solid #007bff;
  padding: 10px;
  margin-bottom: 10px;
}

.answered-question {
  opacity: 0.7;
  color: #555;
}

<div [ngClass]="{'current-question': i === visibleQuestions.length - 1, 'answered-question': i < visibleQuestions.length - 1}">
  ...
</div>
