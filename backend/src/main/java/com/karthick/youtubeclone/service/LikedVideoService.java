package com.karthick.youtubeclone.service;

import com.karthick.youtubeclone.entity.LikeVideo;
import com.karthick.youtubeclone.repository.LikeVideoRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class LikedVideoService {


    private final LikeVideoRepo likeVideoRepo;



    /**
     * This method update watched video into table if the specific video is already watched in current day
     * the existing video document data updated, Otherwise new document will be inserted at collection
     *
     * @param videoUserInfo
     * @param database
     */
    public void addLikedVideoInDB(String userId, String videoId, Set<String> topics) {


        LikeVideo likeVideo = new LikeVideo();
        likeVideo.setVideoId(videoId);
        likeVideo.setUserId(userId);
        likeVideo.setLikedOn(LocalDateTime.now());
        likeVideo.setLikeTopics(topics);

        likeVideoRepo.save(likeVideo);


    }


    public void removeLikedVideoFromDB(String userId, String videoId){

        likeVideoRepo.deleteByUserIdAndVideoId(userId, videoId);

    }


}
