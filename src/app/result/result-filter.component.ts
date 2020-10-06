import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

@Component({
  template: `

  `
})
export class ResultFilterComponent implements OnInit, OnDestroy {
  @Input() title: any;

  @Input() originalShareclassGreen: any;
  @Input() originalShareclassFilter: any;
  @Input() disableCheck: any;

  @Input() originalShareclassYellow: any;
  @Input() originalShareclassRed: any;
  @Input() originalShareclassNotApplicable: any;

  @Output() changeCheckValue = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  changeCheck() {
    this.changeCheckValue.emit();
  }
}
