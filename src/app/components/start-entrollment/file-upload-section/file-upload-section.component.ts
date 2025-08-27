import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-file-upload-section',
  standalone: true,
  imports: [ButtonModule, DropdownModule],
  templateUrl: './file-upload-section.component.html',
  styles: [
    ``
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadSectionComponent {

}
