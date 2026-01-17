import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { QuestionDetailComponent } from './pages/question-detail.component';
import { CreateQuestionComponent } from './pages/create-question.component';
import { QuestionSetsComponent } from './pages/question-sets.component';
import { CollectionsComponent } from './pages/collections.component';
import { MyAnswersComponent } from './pages/my-answers.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'questions/:id', component: QuestionDetailComponent },
  { path: 'questions/create', component: CreateQuestionComponent },
  { path: 'question-sets', component: QuestionSetsComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'my-answers', component: MyAnswersComponent }
];
