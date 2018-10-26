import { Component, OnDestroy } from '@angular/core';
import { TemplateService } from '../../template.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector   : 'fuse-template-main-sidenav',
    templateUrl: './main.component.html',
    styleUrls  : ['./main.component.scss']
})
export class FuseTemplateMainSidenavComponent implements OnDestroy
{
    user: any;
    filterBy: string;
    onUserDataChangedSubscription: Subscription;

    constructor(private templateService: TemplateService)
    {
        this.filterBy = this.templateService.filterBy || 'all';
        this.onUserDataChangedSubscription =
            this.templateService.onUserDataChanged.subscribe(user => {
                this.user = user;
            });
    }

    changeFilter(filter)
    {
        this.filterBy = filter;
        this.templateService.onFilterChanged.next(this.filterBy);
    }

    ngOnDestroy()
    {
        this.onUserDataChangedSubscription.unsubscribe();
    }
}
