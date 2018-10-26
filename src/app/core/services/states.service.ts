import { Injectable } from '@angular/core';

@Injectable()
export class StatesService {

 public states = ["Selangor",
                      "Johor"];
  constructor() { }

  public loadStates (){
    return this.states;
  }
}
