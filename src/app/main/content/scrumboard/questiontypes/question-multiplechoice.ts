import { QuestionBase } from './question-base';

export class TextboxQuestion extends QuestionBase<string> {
  controlType = 'textbox';
  type: string;
  choices: { key: string, value: number }[] = [];

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }

  addChoice(label, value) {
    // add an option and return an order
    return this.choices.push({ key: label, value: value });
  }

  removeChoice(index) {
    //remove choice at index
    return true;
  }


}
