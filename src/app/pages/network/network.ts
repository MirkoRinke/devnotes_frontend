import { Component } from '@angular/core';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-network',
  imports: [ActionPlaceholder],
  templateUrl: './network.html',
  styleUrl: './network.scss',
})
export class Network {
  constructor(public authService: AuthService) {}
}
