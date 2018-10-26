import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumboardService } from '../scrumboard.service';
import { ScrumboardFbService } from '../scrumboard-fb.service';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';
import { List } from '../list.model';
import { fuseAnimations } from '../../../../core/animations';

@Component({
    selector   : 'fuse-scrumboard-board',
    templateUrl: './board.component.html',
    styleUrls  : ['./board.component.scss'],
    animations : fuseAnimations
})
export class FuseScrumboardBoardComponent implements OnInit, OnDestroy
{
    board: any;
    onBoardChanged: Subscription;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private scrumboardService: ScrumboardFbService,
    )
    {
    }

    ngOnInit()
    {
        this.onBoardChanged =
            this.scrumboardService.onBoardChanged
                .subscribe(board => {
                    this.board = board;
                    console.log("on board changed");
                    console.log(this.board);
                });
    }

    onListAdd(newListName)
    {
        console.log("onListAdd");
        if ( newListName === '' )
        {
            return;
        }
        return;

        //this.scrumboardService.addList(new List({name: newListName}));
    }

    onBoardNameChanged(newName)
    {
        console.log("onBoardNameChanged");
        this.scrumboardService.updateBoard();
        this.location.go('/boards/' + this.board.id + '/' + this.board.uri);
    }

    onDrop(ev)
    {
        console.log("onDrop");
        this.scrumboardService.updateBoard();
    }

    ngOnDestroy()
    {
        this.onBoardChanged.unsubscribe();
    }
}
