import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'keephtml',
  pure: false
})
export class KeephtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer){}

  transform(content): any {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

}
