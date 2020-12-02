import { Component, } from '@angular/core';
import { ActionService } from 'src/app/services/actions/action.service';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss'],
})
export class ActionComponent {
  constructor(public actionService: ActionService) { }
}
