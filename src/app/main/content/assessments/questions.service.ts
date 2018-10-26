import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Question } from './question.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class QuestionsService implements Resolve<any>
{
    onQuestionsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedQuestionsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    questions: Question[];
    user: any;
    selectedQuestions: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(private http: HttpClient)
    {
    }

    /**
     * The Questions App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getQuestions(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getQuestions();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getQuestions();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getQuestions(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get('api/questions-questions')
                    .subscribe((response: any) => {

                        this.questions = response;

                        if ( this.filterBy === 'starred' )
                        {
                            this.questions = this.questions.filter(_question => {
                                return this.user.starred.includes(_question.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.questions = this.questions.filter(_question => {
                                return this.user.frequentQuestions.includes(_question.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.questions = FuseUtils.filterArrayByString(this.questions, this.searchText);
                        }

                        this.questions = this.questions.map(question => {
                            return new Question(question);
                        });

                        this.onQuestionsChanged.next(this.questions);
                        resolve(this.questions);
                    }, reject);
            }
        );
    }

    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get('api/questions-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected question by id
     * @param id
     */
    toggleSelectedQuestion(id)
    {
        // First, check if we already have that todo as selected...
        if ( this.selectedQuestions.length > 0 )
        {
            const index = this.selectedQuestions.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedQuestions.splice(index, 1);

                // Trigger the next event
                this.onSelectedQuestionsChanged.next(this.selectedQuestions);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedQuestions.push(id);

        // Trigger the next event
        this.onSelectedQuestionsChanged.next(this.selectedQuestions);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll()
    {
        if ( this.selectedQuestions.length > 0 )
        {
            this.deselectQuestions();
        }
        else
        {
            this.selectQuestions();
        }
    }

    selectQuestions(filterParameter?, filterValue?)
    {
        this.selectedQuestions = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedQuestions = [];
            this.questions.map(question => {
                this.selectedQuestions.push(question.id);
            });
        }
        else
        {
            /* this.selectedQuestions.push(...
                 this.questions.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedQuestionsChanged.next(this.selectedQuestions);
    }

    updateQuestion(question)
    {
        return new Promise((resolve, reject) => {

            this.http.post('api/questions-questions/' + question.id, {...question})
                .subscribe(response => {
                    this.getQuestions();
                    resolve(response);
                });
        });
    }

    updateUserData(userData)
    {
        return new Promise((resolve, reject) => {
            this.http.post('api/questions-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getQuestions();
                    resolve(response);
                });
        });
    }

    deselectQuestions()
    {
        this.selectedQuestions = [];

        // Trigger the next event
        this.onSelectedQuestionsChanged.next(this.selectedQuestions);
    }

    deleteQuestion(question)
    {
        const questionIndex = this.questions.indexOf(question);
        this.questions.splice(questionIndex, 1);
        this.onQuestionsChanged.next(this.questions);
    }

    deleteSelectedQuestions()
    {
        for ( const questionId of this.selectedQuestions )
        {
            const question = this.questions.find(_question => {
                return _question.id === questionId;
            });
            const questionIndex = this.questions.indexOf(question);
            this.questions.splice(questionIndex, 1);
        }
        this.onQuestionsChanged.next(this.questions);
        this.deselectQuestions();
    }

}
