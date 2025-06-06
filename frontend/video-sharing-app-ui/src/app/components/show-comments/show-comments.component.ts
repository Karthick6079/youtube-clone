import { Component, Input } from '@angular/core';
import { CommentDTO } from '../../dto/video-dto';
import { CommentService } from '../../services/comment/comment.service';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../services/login/login.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { IndianFormatViewCount } from '../../pipes/indianformatviewcount.pipe';

@Component({
  selector: 'app-show-comments',
  templateUrl: './show-comments.component.html',
  styleUrl: './show-comments.component.css',
})
export class ShowCommentsComponent {
  @Input()
  comment!: CommentDTO;

  public isAuthenticated: boolean = false;

  avatarError = false;

  constructor(
    private commentService: CommentService,
    private messageService: MessageService,
    private loginService: LoginService,
    private oidcSecurityService: OidcSecurityService,
    private indianFormatViewCount: IndianFormatViewCount
  ) {}

  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        this.isAuthenticated = isAuthenticated;
      }
    );
  }

  likeComment() {
    if (!this.isUserLoggedIn())
      return;

    this.commentService
        .likeComment(this.comment.videoId, this.comment.userId, this.comment.id)
        .subscribe((comment) => {
          this.comment = comment;
        });
  }

  disLikeComment() {
    if (!this.isUserLoggedIn())
      return;

    this.commentService
      .dislikeComment(
        this.comment.videoId,
        this.comment.userId,
        this.comment.id
      )
      .subscribe((comment) => {
        this.comment = comment;
      });
  }

  isUserLoggedIn() {
    if (!this.isAuthenticated) {
      this.loginService.login();
      return false;
    }
    return true;
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
