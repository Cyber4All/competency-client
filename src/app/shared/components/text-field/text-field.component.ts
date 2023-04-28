import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  SimpleChanges,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'cc-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements OnChanges {
  @Input() value!: any;
  @Output() valueChange = new EventEmitter<string>();

  @Input() label = 'Text field';
  @Input() type: HTMLInputElement['type'] = 'text';
  @Input() @HostBinding('class.text-field--block') block = false;
  @Input() required!: boolean;
  @Input() autofocus = false;
  @Input() disabled = false;
  @Input() allowShowPasswordOption!: boolean;
  @Input() autocomplete = 'on';

  @Input() showValidity!: boolean;
  @Input() isValid!: boolean;
  @Input() isLoading!: boolean;
  @Input() error!: string;

  // flags
  isFocused!: boolean;
  hasContent!: boolean;

  showPassword = false;
  isTouched = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.hasContent = Boolean(this.value.length);
    }
  }

  get validity() {
    return (!this.required || this.value) && this.isValid !== false;
  }
}
