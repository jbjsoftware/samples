// :host {
//     display: flex;
//     flex-flow: column;
//     flex: 1 0 0px;
//     background-color: #f5f5f5;
//   }

  
//   <div [ngClass]='containerClass' class="d-flex flex-column flex-fill">

//   <div class="row flex-fill">

//     <div [ngClass]='colClass' class='card p-xs-0 py-3 px-4 mx-2 my-3 flex-column flex-fill' style='overflow-x: hidden;'>

//       <ng-content></ng-content>

//     </div>

//   </div>

// </div>


import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-centered-form-container',
  templateUrl: './centered-form-container.component.html',
  styleUrls: ['./centered-form-container.component.scss']
})
export class CenteredFormContainerComponent {
  @Input() colClass = 'col-24';
  @Input() containerClass = 'container';
}
