import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Template } from './template.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class TemplateService implements Resolve<any>
{
    onTemplateChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedTemplateChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    template: Template[];
    user: any;
    selectedTemplate: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(private http: HttpClient)
    {
    }

    /**
     * The Template App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getTemplate(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getTemplate();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getTemplate();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getTemplate(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get('api/template-template')
                    .subscribe((response: any) => {

                        this.template = response;

                        if ( this.filterBy === 'starred' )
                        {
                            this.template = this.template.filter(_template => {
                                return this.user.starred.includes(_template.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.template = this.template.filter(_template => {
                                return this.user.frequentTemplate.includes(_template.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.template = FuseUtils.filterArrayByString(this.template, this.searchText);
                        }

                        this.template = this.template.map(template => {
                            return new Template(template);
                        });

                        this.onTemplateChanged.next(this.template);
                        resolve(this.template);
                    }, reject);
            }
        );
    }

    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get('api/template-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
    }

    /**
     * Toggle selected template by id
     * @param id
     */
    toggleSelectedTemplate(id)
    {
        // First, check if we already have that todo as selected...
        if ( this.selectedTemplate.length > 0 )
        {
            const index = this.selectedTemplate.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedTemplate.splice(index, 1);

                // Trigger the next event
                this.onSelectedTemplateChanged.next(this.selectedTemplate);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedTemplate.push(id);

        // Trigger the next event
        this.onSelectedTemplateChanged.next(this.selectedTemplate);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll()
    {
        if ( this.selectedTemplate.length > 0 )
        {
            this.deselectTemplate();
        }
        else
        {
            this.selectTemplate();
        }
    }

    selectTemplate(filterParameter?, filterValue?)
    {
        this.selectedTemplate = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedTemplate = [];
            this.template.map(template => {
                this.selectedTemplate.push(template.id);
            });
        }
        else
        {
            /* this.selectedTemplate.push(...
                 this.template.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedTemplateChanged.next(this.selectedTemplate);
    }

    updateTemplate(template)
    {
        return new Promise((resolve, reject) => {

            this.http.post('api/template-template/' + template.id, {...template})
                .subscribe(response => {
                    this.getTemplate();
                    resolve(response);
                });
        });
    }

    updateUserData(userData)
    {
        return new Promise((resolve, reject) => {
            this.http.post('api/template-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getTemplate();
                    resolve(response);
                });
        });
    }

    deselectTemplate()
    {
        this.selectedTemplate = [];

        // Trigger the next event
        this.onSelectedTemplateChanged.next(this.selectedTemplate);
    }

    deleteTemplate(template)
    {
        const templateIndex = this.template.indexOf(template);
        this.template.splice(templateIndex, 1);
        this.onTemplateChanged.next(this.template);
    }

    deleteSelectedTemplate()
    {
        for ( const templateId of this.selectedTemplate )
        {
            const template = this.template.find(_template => {
                return _template.id === templateId;
            });
            const templateIndex = this.template.indexOf(template);
            this.template.splice(templateIndex, 1);
        }
        this.onTemplateChanged.next(this.template);
        this.deselectTemplate();
    }

}
