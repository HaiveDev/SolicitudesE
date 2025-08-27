import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EditableUserInfoFormComponent } from '@components/start-entrollment/editable-user-info-form/editable-user-info-form.component';
import { ReadonlyPropertyInfoComponent } from '@components/start-entrollment/readonly-property-info/readonly-property-info.component';
import { MeterDataComponent } from '@components/start-entrollment/meter-data/meter-data.component';
import { FileUploadSectionComponent } from '@components/start-entrollment/file-upload-section/file-upload-section.component';

import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-start-enrollment',
  standalone: true,
  imports: [EditableUserInfoFormComponent, ReadonlyPropertyInfoComponent, MeterDataComponent, FileUploadSectionComponent, DividerModule],
  templateUrl: './start-enrollment.component.html',
  styleUrl: './start-enrollment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartEnrollmentComponent {

}
