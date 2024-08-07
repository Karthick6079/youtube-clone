import { Component } from '@angular/core';
import { LikedVideoDTO, VideoDto } from '../../dto/video-dto';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from '../../services/user/user.service';
import { Observable } from 'rxjs';
import _ from 'lodash';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  unAuthUIInfotitle = 'Enjoy your favorite videos';
  unAuthUIInfoDesc = `Sign in to access videos that you’ve liked`;

  likedVideos!: VideoDto[];
  isDataAvailable = false;
  isAuthenticated!: boolean;
  page: number = 0;
  size: number = 6;
  videosGroupedByDay!: _.Dictionary<LikedVideoDTO[]>;

  constructor(
    private userService: UserService,
    private oidcSecurityService: OidcSecurityService
  ) {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  reverseKeyOrder = (
    a: KeyValue<string, LikedVideoDTO[]>,
    b: KeyValue<string, LikedVideoDTO[]>
  ): number => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastSevenDays = new Date(today);
    lastSevenDays.setDate(today.getDate() - 7);
    if (
      a.key === 'Today' ||
      a.key === 'Yesterday' ||
      a.key === 'Last seven days'
    ) {
      return 1;
    } else {
      return Date.parse(b.key) - Date.parse(a.key);
    }
  };

  watchedVideos$!: Observable<VideoDto[]>;

  ngOnInit(): void {
    this.getLikedVideos(true);
  }

  getLikedVideos(isCompLoad: boolean) {
    if (this.isAuthenticated) {
      if (!isCompLoad) {
        this.page = this.page + 1;
      }
      this.userService
        .getLikedVideos(this.page, this.size)
        .subscribe((videos) => {
          this.likedVideos = videos;

          if (videos && videos.length > 0) {
            this.groupByDays(videos);
            this.isDataAvailable = true;
          } else {
            this.unAuthUIInfoDesc =
              'You yet to like videos. Like your favorite videos and get personalized recommendations';
          }
        });
    }
  }

  groupByDays(videos: LikedVideoDTO[]) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastSevenDays = new Date(today);
    lastSevenDays.setDate(today.getDate() - 7);

    const groupByDay = _.groupBy(videos, (item) => {
      const itemDate = new Date(item.likedOn);
      if (itemDate.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (itemDate.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else if (itemDate > lastSevenDays) {
        return 'Last seven days';
      } else {
        return `${itemDate.toLocaleString('default', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`;
      }
    });

    this.videosGroupedByDay = this.mergeDictionary(
      this.videosGroupedByDay,
      groupByDay
    );
  }

  mergeDictionary(existing: any, newDict: any) {
    var returnDict: any = {};
    if (existing) {
      for (var key in existing) {
        returnDict[key] = existing[key];
      }
    }

    for (var key in newDict) {
      if (existing && existing[key]) {
        returnDict[key].push(...newDict[key]);
      } else {
        returnDict[key] = newDict[key];
      }
    }
    return returnDict;
  }
}
