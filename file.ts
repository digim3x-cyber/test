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
    // Na początku wyświetlamy tylko pierwsze pytanie
    this.visibleQuestions = [this.questions[0]];
    this.updateVisibleQuestions();
  }

  answerQuestion(questionId: string, selectedAnswer: string) {
    // Znajdź pytanie w tablicy pytań
    const question = this.questions.find((q) => q.id === questionId);
    if (question) {
      question.selectedAnswer = selectedAnswer;

      // Usuń wszystkie pytania, które są dziećmi tego pytania
      const nextQuestionId = question.answers.find((a) => a.text === selectedAnswer)?.nextQuestionId;
      this.removeChildQuestions(questionId);

      // Dodaj kolejne pytanie, jeśli istnieje
      if (nextQuestionId) {
        const nextQuestion = this.questions.find((q) => q.id === nextQuestionId);
        if (nextQuestion) {
          this.visibleQuestions.push(nextQuestion);
        }
      }

      this.updateVisibleQuestions();
    }
  }

  private removeChildQuestions(parentQuestionId: string) {
    const parentIndex = this.visibleQuestions.findIndex((q) => q.id === parentQuestionId);
    if (parentIndex !== -1) {
      this.visibleQuestions = this.visibleQuestions.slice(0, parentIndex + 1);
    }
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
}


<div *ngFor="let question of visibleQuestions; let i = index">
  <div [ngClass]="{'current-question': i === visibleQuestions.length - 1, 'answered-question': i < visibleQuestions.length - 1}">
    <h2>{{ question.text }}</h2>

    <form>
      <div *ngFor="let answer of question.answers">
        <label>
          <input
            type="radio"
            name="{{ question.id }}"
            [value]="answer.text"
            [checked]="question.selectedAnswer === answer.text"
            (change)="onAnswerSelected(question.id, answer.text)"
          />
          {{ answer.text }}
        </label>
      </div>
    </form>

    <p *ngIf="question.selectedAnswer">Wybrano: {{ question.selectedAnswer }}</p>
  </div>
</div>

          .current-question {
  font-weight: bold;
  border: 2px solid #007bff;
  padding: 10px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

.answered-question {
  opacity: 0.8;
  color: #666;
  margin-bottom: 10px;
}

form label {
  display: block;
  margin: 5px 0;
}
