package com.karthick.videosharingapp.entity;


import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;


@Document(collection = "watchedVideos")
@Getter
@Setter
@RequiredArgsConstructor
public class VideoWatch extends  VideoUserInfo {

    @Id
    private String id;

    private Instant watchedAt = Instant.now();

    private Set<String> watchTopics;

}
