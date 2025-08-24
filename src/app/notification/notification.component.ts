import { Component, OnInit } from '@angular/core';

import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  standalone: false,
})
export class NotificationComponent implements OnInit {
  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    return;
  }
}
