import { QuestionBase } from './question-base';

export class SubjectiveQuestion extends QuestionBase<string> {
  controlType = 'textbox1';
  type: string;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}
