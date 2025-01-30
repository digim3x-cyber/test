import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Question, QUESTIONS } from './model';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private questions = QUESTIONS;
  private currentQuestionSubject = new BehaviorSubject<Question | null>(this.questions[0]);
  currentQuestion$ = this.currentQuestionSubject.asObservable();

  private history: { question: Question; answer: string }[] = [];

  constructor() {}

  answerQuestion(selectedAnswer: string) {
    const currentQuestion = this.currentQuestionSubject.value;
    if (!currentQuestion) return;

    // Dodajemy do historii aktualne pytanie i wybraną odpowiedź
    this.history.push({ question: currentQuestion, answer: selectedAnswer });

    const nextQuestionId = currentQuestion.answers.find((a) => a.text === selectedAnswer)?.nextQuestionId;
    const nextQuestion = this.questions.find((q) => q.id === nextQuestionId);

    this.currentQuestionSubject.next(nextQuestion || null);
  }

  goBack() {
    if (this.history.length > 0) {
      // Cofamy się do poprzedniego pytania i usuwamy je z historii
      const previous = this.history.pop();
      if (previous) {
        this.currentQuestionSubject.next(previous.question);
      }
    }
  }
}

<mat-card *ngIf="currentQuestion; else endTemplate" class="question-container">
  <mat-card-title>{{ currentQuestion.text }}</mat-card-title>
  <mat-card-content>
    <mat-radio-group (change)="onAnswerSelected($event.value)">
      <mat-radio-button *ngFor="let answer of currentQuestion.answers" [value]="answer.text">
        {{ answer.text }}
      </mat-radio-button>
    </mat-radio-group>
  </mat-card-content>

  <mat-card-actions class="button-group">
    <button mat-raised-button color="primary" (click)="goBack()" [disabled]="historyLength === 0">
      ⬅ Wstecz
    </button>
  </mat-card-actions>
</mat-card>

<ng-template #endTemplate>
  <mat-card class="question-container">
    <mat-card-title>Dziękujemy za wypełnienie kwestionariusza!</mat-card-title>
    <mat-card-actions>
      <button mat-raised-button color="accent" (click)="goBack()">⬅ Wróć do poprzedniego pytania</button>
    </mat-card-actions>
  </mat-card>
</ng-template>


        import { Component } from '@angular/core';
import { Question } from './model';
import { QuestionnaireService } from './questionnaire-service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
})
export class QuestionnaireComponent {
  currentQuestion: Question | null = null;
  historyLength: number = 0;

  constructor(private questionnaireService: QuestionnaireService) {
    this.questionnaireService.currentQuestion$.subscribe((question) => {
      this.currentQuestion = question;
    });
  }

  onAnswerSelected(selectedAnswer: string) {
    this.questionnaireService.answerQuestion(selectedAnswer);
    this.historyLength++;
  }

  goBack() {
    this.questionnaireService.goBack();
    this.historyLength--;
  }
}


.question-container {
  width: 500px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
}

mat-radio-group {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 15px;
}

mat-radio-button {
  margin: 5px 0;
}

.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

button {
  min-width: 120px;
}

mat-card {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


