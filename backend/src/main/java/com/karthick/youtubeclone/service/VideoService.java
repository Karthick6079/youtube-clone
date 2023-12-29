package com.karthick.youtubeclone.service;

import com.karthick.youtubeclone.dto.CommentDTO;
import com.karthick.youtubeclone.dto.UploadVideoResponse;
import com.karthick.youtubeclone.dto.VideoDTO;
import com.karthick.youtubeclone.entity.Comment;
import com.karthick.youtubeclone.entity.User;
import com.karthick.youtubeclone.entity.Video;
import com.karthick.youtubeclone.repository.VideoRepository;
import com.karthick.youtubeclone.servicelogic.VideoServiceLogic;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final S3Service s3Service;

    private final VideoRepository videoRepository;

    private final ModelMapper mapper;

    private final VideoServiceLogic videoServiceLogic;

    private final UserService userService;


    public UploadVideoResponse uploadFile(MultipartFile file) {
        String url = s3Service.uploadFile(file);

        Video video = new Video();
        video.setVideoUrl(url);

        Video savedVideo =  videoRepository.save(video);

        return new UploadVideoResponse(url, savedVideo.getId());

    }

    public UploadVideoResponse uploadThumbnail(MultipartFile file, String videoId) {
        String url = s3Service.uploadFile(file);

        Video savedVideo = findVideoById(videoId)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find video by Id" + videoId));
        savedVideo.setThumbnailUrl(url);

        videoRepository.save(savedVideo);

        return new UploadVideoResponse(url, savedVideo.getId());

    }

    public VideoDTO editVideoMetaData(VideoDTO videoDto) {
        Video savedVideo = getVideoFromDB(videoDto.getId());

        savedVideo.setVideoStatus(videoDto.getVideoStatus());
        savedVideo.setTags(videoDto.getTags());
        savedVideo.setThumbnailUrl(videoDto.getThumbnailUrl());
        savedVideo.setDescription(videoDto.getDescription());
        savedVideo.setTitle(videoDto.getTitle());

        //update video url to video dto
        videoDto.setVideoUrl(savedVideo.getVideoUrl());

        videoRepository.save(savedVideo);

        return videoDto;

    }

    public Optional<Video> findVideoById(String id) {
        return videoRepository.findById(id);
    }


    private Video getVideoFromDB(String id){
        return findVideoById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cannot find video by Id" + id));
    }

    public VideoDTO getVideo(String videoId) {
        Video video = getVideoFromDB(videoId);

        video.increaseViewCount();
        userService.addToWatchHistory(videoId);
        videoRepository.save(video);

        return mapper.map(video, VideoDTO.class);

    }

    public VideoDTO likeVideo(String videoId) {

        // Get Video and user entity from DB
        Video video = getVideoFromDB(videoId);
        User user = userService.getCurrentUser();

        //Updating like count based on different scenario
        videoServiceLogic.likeVideo(video, user,videoId);

        // After manipulating likes count and liked video list
        // Save video and user entity to database
        videoRepository.save(video);
        userService.saveUser(user);

        return mapper.map(video, VideoDTO.class);


    }
    public VideoDTO dislikeVideo(String videoId) {

        // Get Video and user entity from DB
        Video video = getVideoFromDB(videoId);
        User user = userService.getCurrentUser();

        //Updating dislike count based on different scenario
        videoServiceLogic.dislikeVideo(video, user,videoId);

        // After manipulating dislikes count and disliked video list
        // Save video and user entity to database
        videoRepository.save(video);
        userService.saveUser(user);

        return mapper.map(video, VideoDTO.class);


    }

    public void addComment(CommentDTO commentDto, String videoId) {

        Video video = getVideoFromDB(videoId);
        Comment comment = mapper.map(commentDto, Comment.class);
        video.addComment(comment);
        videoRepository.save(video);

    }

    public List<CommentDTO> getAllComments(String videoId) {
        Video video = getVideoFromDB(videoId);
        List<Comment> commentList = video.getCommentList();
        return mapToList(commentList, CommentDTO.class);
    }

    public List<VideoDTO> getAllVideos(){
       return mapToList(videoRepository.findAll(), VideoDTO.class);
    }


    public <S, T> List<T> mapToList(List<S> source, Class<T> targetClassType){
        return source.stream()
                .map( sourceItem -> mapper.map(sourceItem, targetClassType))
                .collect(Collectors.toList());
    }
}
