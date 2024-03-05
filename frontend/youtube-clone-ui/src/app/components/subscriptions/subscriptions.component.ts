import { Component, OnInit } from '@angular/core';
import { VideoDto } from '../../dto/video-dto';
import { UserService } from '../../services/user/user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { VideoService } from '../../services/video/video.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent implements OnInit {
  getSubscriptionVideos() {
    throw new Error('Method not implemented.');
  }
  subscribedChannalVideos!: VideoDto[];
  isDataAvailable = false;
  isAuthenticated!: boolean;

  constructor(
    private videoService: VideoService,
    private oidcSecurityService: OidcSecurityService
  ) {}
  ngOnInit(): void {
    this.videoService.getSubscriptionVideos().subscribe((videos) => {
      console.log(videos);
      this.subscribedChannalVideos = videos;
      this.isDataAvailable = true;
    });
  }
}
