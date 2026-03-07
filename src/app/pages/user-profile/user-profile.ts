import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  userId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      const userId = Number(paramId);

      if (!paramId || isNaN(userId) || !Number.isInteger(userId)) {
        console.warn('Invalid or missing user_id:', paramId);
        this.router.navigate(['/']);
        return;
      }
      this.userId = userId;

      // this.loadUserProfile(this.userId);
    });
  }
}
