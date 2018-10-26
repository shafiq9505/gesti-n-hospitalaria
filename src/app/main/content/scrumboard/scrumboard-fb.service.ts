import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ScrumboardFbService implements Resolve<any> {

  boards: any[];
  routeParams: any;
  board: any;

  onBoardsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onBoardChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private readonly afs: AngularFirestore) { }

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
              this.getBoards()
          ]).then(
              () => {
                  resolve();
              },
              reject
          );
      });
  }

  addCard(listId, newCard)
  {
      this.board.lists.map((list) => {
          if ( list.id === listId )
          {
              return list.idCards.push(newCard.id);
          }
      });

      
      this.board.cards.push(JSON.parse(JSON.stringify(newCard)));

      return this.updateBoard();
  }


  addList(newList)
  {

      this.board.lists.push(newList);

      return this.updateBoard();

  }


  removeList(listId)
  {
      const list = this.board.lists.find((_list) => {
          return _list.id === listId;
      });

      for ( const cardId of list.idCards )
      {
          this.removeCard(cardId);
      }

      const index = this.board.lists.indexOf(list);

      this.board.lists.splice(index, 1);

      return this.updateBoard();
  }


  removeCard(cardId, listId?)
  {

      const card = this.board.cards.find((_card) => {
          return _card.id === cardId;
      });

      if ( listId )
      {
          const list = this.board.lists.find((_list) => {
              return listId === _list.id;
          });
          list.idCards.splice(list.idCards.indexOf(cardId), 1);
      }

      this.board.cards.splice(this.board.cards.indexOf(card), 1);

      this.updateBoard();
  }


  updateBoard()
  {
    return new Promise((resolve, reject) => {
      console.log(this.board);
      this.afs.doc('boards/' + this.board.id).set(this.board)
        .then(response => {
          resolve(this.board);
        }, reject);
    });
  }

  updateCard(newCard)
  {
      this.board.cards.map((_card) => {
          if ( _card.id === newCard.id )
          {
              return newCard;
          }
      });

      this.updateBoard();
  }

  getBoards(): Promise<any>
  {
    return new Promise((resolve, reject) => {
        this.afs.collection('boards').snapshotChanges()
          .map(actions => {
            return actions.map(action => {
              const data = action.payload.doc.data();
              const guid = action.payload.doc.id;
              return { guid, ...data };
            });
          })
          .subscribe((response: any) => {
            this.boards = response;
            this.onBoardsChanged.next(this.boards);
            resolve(this.boards);
          }, reject);
    });

  }

  getBoard(boardId): Promise<any>
  {
    console.log("getBoard: " + boardId);
    return new Promise((resolve, reject) => {
      this.afs.doc('boards/' + boardId).valueChanges()
        .subscribe((response: any) => {
          this.board = response;
          console.log("getBoard");
          console.log(this.board);
          this.onBoardChanged.next(this.board);
          resolve(this.board);
        }, reject);
    });
  }

  createNewBoard(id, board)
  {
    return new Promise((resolve, reject) => {
      this.afs.doc('boards/' + id).set(board)
        .then(response => {
          resolve(board);
        }, reject);
    });
  }

}

@Injectable()
export class BoardFBResolve implements Resolve<any>
{

    constructor(private scrumboardService: ScrumboardFbService)
    {
    }

    resolve(route: ActivatedRouteSnapshot)
    {
        return this.scrumboardService.getBoard(route.paramMap.get('boardId'));
    }
}
