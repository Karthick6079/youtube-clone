import { Component, Input, OnInit } from '@angular/core';
import { UserDto, VideoDto } from '../../dto/video-dto';
import { MessageService } from 'primeng/api';
import { UserService } from '../../services/user/user.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-shorts-vid-info',
  templateUrl: './shorts-vid-info.component.html',
  styleUrl: './shorts-vid-info.component.css',
})
export class ShortsVidInfoComponent implements OnInit {
  subscribed: boolean = false;
  unsubscribed: boolean = false;

  currentUser!: UserDto;

  @Input()
  video!: VideoDto;

  public isAuthenticated: boolean = false;

  constructor(
    private messageService: MessageService,
    private userService: UserService,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit(): void {
    console.log(this.video);
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    this.subscribed = this.isCurrentUserSubscribed();
  }

  isCurrentUserSubscribed() {
    if (
      this.currentUser &&
      this.currentUser.subscribedToUsers.includes(this.video?.userId)
    ) {
      return true;
    } else {
      return false;
    }
  }

  unsubscribe() {
    if (this.showLoginMessageIfNot('Please login to subscribe this channal!')) {
      this.userService
        .unsubscribeUser(String(this.video.userId))
        .subscribe((userDto: UserDto) => {
          this.currentUser = userDto;
          this.subscribed = this.isCurrentUserSubscribed();
        });
    }
  }
  subscribe() {
    if (this.showLoginMessageIfNot('Please login to subscribe this channal!')) {
      this.userService
        .subscribeUser(String(this.video.userId))
        .subscribe((userDto: UserDto) => {
          this.currentUser = userDto;
          this.subscribed = this.isCurrentUserSubscribed();
        });
    }
  }

  showLoginMessageIfNot(message?: string) {
    if (!this.isAuthenticated) {
      message = message ? message : 'Please login before share your feedback!';
      this.setLoginMessage(message);
      return false;
    }
    return true;
  }

  setLoginMessage(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
      sticky: false,
      life: 5000,
      key: 'tc',
    });
  }
}
