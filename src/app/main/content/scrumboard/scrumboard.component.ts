import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScrumboardService } from './scrumboard.service';
import { ScrumboardFbService } from './scrumboard-fb.service';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';
import { Board } from './board.model';
import { List } from './list.model';
import { fuseAnimations } from '../../../core/animations';

@Component({
    selector   : 'fuse-scrumboard',
    templateUrl: './scrumboard.component.html',
    styleUrls  : ['./scrumboard.component.scss'],
    animations : fuseAnimations
})
export class FuseScrumboardComponent implements OnInit, OnDestroy
{
    boards: any[];
    onBoardsChanged: Subscription;

    constructor(
        private router: Router,
        private scrumboardService: ScrumboardService,
        private scrumboardFBService: ScrumboardFbService
    )
    {

    }

    ngOnInit()
    {
        this.onBoardsChanged =
            this.scrumboardFBService.onBoardsChanged
                .subscribe(boards => {
                    this.boards = boards;
                    console.log(this.boards);
                });

    }

    newBoard()
    {
        const lists = [];
        var list = new List({},'Organised Question Set');
        list.ismodule = true;
        lists.push(list);

        // list = new List({},'Question Bank');
        // list.issubjective = true;
        // lists.push(list);


        const newBoard = new Board({}, lists);
        console.log(JSON.parse(JSON.stringify(newBoard)));
        this.scrumboardFBService.createNewBoard(newBoard.id, JSON.parse(JSON.stringify(newBoard)))
          .then(() => {
            this.router.navigate(['/boards/' + newBoard.id + '/' + newBoard.uri]);
          });
        // this.scrumboardFBService.createNewBoard(newBoard.id, { ...newBoard });
        // this.scrumboardService.createNewBoard(newBoard).then(() => {
        //     this.router.navigate(['/boards/' + newBoard.id + '/' + newBoard.uri]);
        // });

    }

    ngOnDestroy()
    {
        this.onBoardsChanged.unsubscribe();
    }
}
