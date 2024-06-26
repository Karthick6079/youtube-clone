package com.karthick.youtubeclone.entity;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document( collection = "likeComments")
@Getter
@Setter
@RequiredArgsConstructor
public class LikeComment {

    @Id
    private String id;

    private String commentId;

    private String videoId;

    private String userId;

    private LocalDateTime likedOn;


}
