package com.karthick.videosharingapp.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document( collection = "dislikedComments")
@Getter
@Setter
@RequiredArgsConstructor
public class CommentDislike {

    @Id
    private String id;

    private String commentId;

    private String videoId;

    private String userId;

    private Instant dislikedAt;
}
