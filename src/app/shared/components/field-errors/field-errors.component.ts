import { Component, input } from '@angular/core';

@Component({
  selector: 'app-field-errors',
  templateUrl: './field-errors.component.html'
})
export class FieldErrorsComponent { field = input.required<any>(); }
