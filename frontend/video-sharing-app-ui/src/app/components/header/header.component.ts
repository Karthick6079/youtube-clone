import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {
  ConfigUserDataResult,
  OidcSecurityService,
  UserDataResult,
} from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormControl } from '@angular/forms';

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

  isMobileScreen = false;

  isNewMobileScreen = false;

  searchControl = new FormControl('');

  userData!: Observable<UserDataResult>;

  avatarError = false;


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

    if (window.matchMedia('(max-width: 770px)').matches) {
      this.isMobileScreen = true;
      this.isNewMobileScreen = true;
    } else{
      this.isNewMobileScreen = false;
    }

    
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

  searchVideos() {
    const searchText = this.searchControl.value;
    if(!searchText) return;
    this.searchControl.setValue(''); //empty after 
    this.router
      .navigateByUrl(`/home/search-results?searchText=${searchText}`)
      .then((e) => {
        if (e) {
        } else {
        }
      });
  }

  showSideBar() {
    const currentURL = this.router.routerState.snapshot.url;

    let isHomeRouteActivated = currentURL.indexOf('home') == -1 ? false : true;

    if (isHomeRouteActivated && !this.isMobileScreen) {
      this.userService.toggleSideBar();
    } else {
      this.userService.toggleSideBarOnOverlay();
    }
  }

  onAvatarError(): void {
    this.avatarError = true;
  }

  getUserInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
}
