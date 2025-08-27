import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-customer-service',
  standalone: true,
  imports: [],
  templateUrl: './customer-service.component.html',
  styleUrl: './customer-service.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerServiceComponent {

}
