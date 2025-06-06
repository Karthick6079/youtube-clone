import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../constants/AppSettings';
import { Observable, catchError, throwError } from 'rxjs';
import { UploadVideoResponse } from '../../dto/upload-video-response';
import { FormGroup } from '@angular/forms';
import { CommentDTO, VideoDto } from '../../dto/video-dto';
import { environment } from '../../../environments/environment';
import { FileSizeExceededException } from '../../exceptions/file-size-exceeded.exception';
import { ReactionResponse } from '../../dto/reaction-response';
@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private UPLOAD_URL: string = '/upload';

  private ThUMBNAIL_URL: string = '/thumbnail';

  private EDIT_META_DATA_URL: string = '/editMetadata';

  private ALL_VIDEOS_URL: string = '/all';

  private SUGGESTED_VIDEO_URL: string = '/suggestion-videos';

  private GET_VIDEDO_URL: string = '/watch/';

  private GET_SHORT_VIDEDO_URL: string = '/short-video';

  private SUBSCRIPTIONS_VIDEO_URL: String = '/subscription-videos';

  constructor(private http: HttpClient) {}

  getVideoBaseUrl(): string {
    return environment.SERVICE_NAME + '/video';
  }

  uploadVideo(formData: FormData): Observable<UploadVideoResponse> {
    return this.http
      .post<UploadVideoResponse>(
        this.getVideoBaseUrl() + this.UPLOAD_URL,
        formData
      )
      .pipe(catchError(this.handleUploadFileErrorRespone));
  }

  handleUploadFileErrorRespone(err: HttpErrorResponse) {
    console.log(err);

    return throwError(() => err);
  }

  uploadThumnail(
    formData: FormData,
    videoId: string
  ): Observable<UploadVideoResponse> {
    formData.append('videoId', videoId);
    return this.http
      .post<UploadVideoResponse>(
        this.getVideoBaseUrl() + this.ThUMBNAIL_URL,
        formData
      )
      .pipe(
        catchError((error) => {
          console.log('File Upload error', error);
          throw new FileSizeExceededException();
        })
      );
  }

  editVideoMeta(requestBody: string): Observable<VideoDto> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<VideoDto>(
      this.getVideoBaseUrl() + this.EDIT_META_DATA_URL,
      requestBody,
      httpOptions
    );
  }

  getVideos(): Observable<VideoDto[]> {
    return this.http.get<VideoDto[]>(
      this.getVideoBaseUrl() + this.ALL_VIDEOS_URL
    );
  }

  getSuggestedVideos(page: number, size: number): Observable<VideoDto[]> {
    let params = new HttpParams().set('page', page).set('size', size);

    const httpOptions = {
      params: params,
    };

    return this.http.get<VideoDto[]>(
      this.getVideoBaseUrl() + this.SUGGESTED_VIDEO_URL,
      httpOptions
    );
  }

  getVideo(videoId: string): Observable<VideoDto> {
    return this.http.get<VideoDto>(
      this.getVideoBaseUrl() + this.GET_VIDEDO_URL + videoId
    );
  }

  updateWatchAndGetVideoDetails(videoId: string): Observable<VideoDto> {
    return this.http.get<VideoDto>(
      this.getVideoBaseUrl() + this.GET_VIDEDO_URL + videoId
    );
  }

  likeVideo(videoId: string, userId: string): Observable<ReactionResponse> {
    return this.http.put<ReactionResponse>(
      this.getVideoBaseUrl() + this.GET_VIDEDO_URL + videoId + '/like/'+ userId, null
    );
  }

  dislikeVideo(videoId: string, userId: string): Observable<ReactionResponse> {
    return this.http.put<ReactionResponse>(
      this.getVideoBaseUrl() + this.GET_VIDEDO_URL + videoId + '/dislike/'+ userId, null
    );
  }

  getShortsVideo(page: number, size: number): Observable<VideoDto[]> {
    let params = new HttpParams().set('page', page).set('size', size);

    const httpOptions = {
      params: params,
    };
    return this.http.get<VideoDto[]>(
      this.getVideoBaseUrl() + this.GET_SHORT_VIDEDO_URL,httpOptions
    );
  }

  getSubscriptionVideos(): Observable<VideoDto[]> {
    return this.http.post<VideoDto[]>(
      this.getVideoBaseUrl() + this.SUBSCRIPTIONS_VIDEO_URL,
      null
    );
  }

  getSearchVideos(searchText: string): Observable<VideoDto[]> {
    let params = new HttpParams().set('searchText', searchText);

    const httpOptions = {
      params: params,
    };

    return this.http.get<VideoDto[]>(
      this.getVideoBaseUrl() + '/search',
      httpOptions
    );
  }

  getTrendingTopics(): Observable<string[]> {
    return this.http.get<string[]>(this.getVideoBaseUrl() + '/trending-topics');
  }

  getVideosByTopic(topic: string): Observable<VideoDto[]> {
    let params = new HttpParams().set('topic', topic);

    const httpOptions = {
      params: params,
    };

    return this.http.get<VideoDto[]>(
      this.getVideoBaseUrl() + '/topic-videos',
      httpOptions
    );
  }
}
