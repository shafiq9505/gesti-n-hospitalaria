import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class FuseBranchInfoService implements Resolve<any>
{
    routeParams: any;
    branchinfo: any;
    onBranchInfoChanged: BehaviorSubject<any> = new BehaviorSubject({});

    constructor(
        private http: HttpClient
    )
    {
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getBranchInfo()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getBranchInfo(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get('api/branchmgt/' + this.routeParams.id)
                .subscribe((response: any) => {
                    this.branchinfo = response;
                    this.onBranchInfoChanged.next(this.branchinfo);
                    resolve(response);
                }, reject);
        });
    }

    saveBranchInfo(branchinfo)
    {
        return new Promise((resolve, reject) => {
            this.http.post('api/branchmgt/' + branchinfo.id, branchinfo)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    addBranchInfo(branchinfo)
    {
        return new Promise((resolve, reject) => {
            this.http.post('api/branchmgt/', branchinfo)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
