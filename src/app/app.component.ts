import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent{
  // textFromChild: string = '';

  // receiveText(event: string) {
  //   this.textFromChild = event;
  //   console.log(this.textFromChild);
  // }
}