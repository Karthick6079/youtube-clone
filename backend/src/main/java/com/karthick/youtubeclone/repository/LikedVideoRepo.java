package com.karthick.youtubeclone.repository;

import com.karthick.youtubeclone.entity.LikedVideo;
import com.karthick.youtubeclone.entity.WatchedVideo;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.ReadPreference;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikedVideoRepo extends MongoRepository<LikedVideo, String> {

     void deleteByUserIdAndVideoId(String userId, String videoId);

     @Aggregation(pipeline = {
             "{$match: { userId: ?0 }}",
             "{$lookup: {from: 'videos',let: {videoId: '$videoId'},pipeline: [{$match: {$expr: {$eq: ['$_id',{$toObjectId: '$$videoId'}]}}}],as: 'video_info'}}",
             "{$unwind: '$video_info'}",
             "{$lookup: {from: 'users',let: {userId: '$userId'},pipeline: [{$match: {$expr: {$eq: ['$_id',{$toObjectId: '$$userId'}]}}}],as: 'user_info'}}",
             "{$sort: {likedOn: -1}}",
             "{$project: {_id: 1,userId: 1,videoId: 1,likedOn: 1,description: '$video_info.description',title: '$video_info.title',likes: '$video_info.likes',disLikes: '$video_info.disLikes',viewCount: '$video_info.viewCount',username: '$user_info.name',userDisplayName: '$user_info.nickname',userPicture: '$user_info.picture', tags: '$video_info.tags',videoStatus: '$video_info.videoStatus',videoUrl: '$video_info.videoUrl',thumbnailUrl: '$video_info.thumbnailUrl', publishedDateAndTime: '$video_info.publishedDateAndTime'}}"
     })
     List<LikedVideo> getLikedVideos(String userId);

}
