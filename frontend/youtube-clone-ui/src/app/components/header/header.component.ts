import { Component, OnInit } from '@angular/core';
import {
  ConfigUserDataResult,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  name: string = '';
  userPictureUrl!: string;

  hideSearchBar = false;
  hideStudioButton = false;
  showSidebarOverlay = false;

  userData!: Observable<UserDataResult>;

  constructor(
    private oidcSecurityService: OidcSecurityService,
    private loginService: LoginService,
    private router: Router,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.oidcSecurityService.userData$.subscribe((response) => {
      if (response.userData) {
        this.name = response.userData.name;
        this.userPictureUrl = response.userData.picture;
      }
    });

    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );

    this.hideButtons();
  }

  hideButtons() {
    this.userService.hideSearchBarEventEmitter.subscribe(
      (isStudio: boolean) => {
        this.hideSearchBar = isStudio;
      }
    );

    this.userService.hideStudioButtonEventEmitter.subscribe(
      (hideStudioButton: boolean) => {
        this.hideStudioButton = hideStudioButton;
      }
    );
  }

  login() {
    this.loginService.login();
  }
  logout() {
    this.loginService.logout();
  }

  navigateToHome() {
    window.location.assign(window.location.origin);
  }

  searchVideos(searchText: string) {
    this.router
      .navigateByUrl(`/home/search-results?searchText=${searchText}`)
      .then((e) => {
        if (e) {
          console.log('Navigation success!!');
        } else {
          console.log('Navigation failed!!');
        }
      });
  }

  showSideBar() {
    const currentURL = this.router.routerState.snapshot.url;

    let isHomeRouteActivated = currentURL.indexOf('home') == -1 ? false : true;

    if (isHomeRouteActivated) {
    }
  }
}
