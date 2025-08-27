import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PersonalInfoFormComponent } from '@components/create-request-form/personal-info-form/personal-info-form.component';

@Component({
  selector: 'app-editable-user-info-form',
  standalone: true,
  imports: [PersonalInfoFormComponent],
  templateUrl: './editable-user-info-form.component.html',
  styles: [
    ``
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditableUserInfoFormComponent {

}
