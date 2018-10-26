import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScrumboardService } from '../../../scrumboard.service';
import { ScrumboardFbService } from '../../../scrumboard-fb.service';
import * as moment from 'moment';

@Component({
    selector     : 'fuse-scrumboard-board-card',
    templateUrl  : './card.component.html',
    styleUrls    : ['./card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseScrumboardBoardCardComponent implements OnInit
{
    @Input() cardId;
    @Input() board;
    card: any;
    // board: any;

    constructor(
        private route: ActivatedRoute,
        private scrumboardService: ScrumboardFbService
    )
    {
    }

    ngOnInit()
    {
        console.log("ngOnInit card component");


        // this.board = this.route.snapshot.data.board;
        console.log("cardboard");
        console.log(this.board);
        this.card = this.board.cards.filter((card) => {
            return this.cardId === card.id;
        })[0];
        if (!this.card){
          console.log(this.cardId);
          console.log(this.card);
          console.log(this.board);
        }
    }

    /**
     * Is the card overdue?
     *
     * @param cardDate
     * @returns {boolean}
     */
    isOverdue(cardDate)
    {
        return moment() > moment(new Date(cardDate));
    }

}
