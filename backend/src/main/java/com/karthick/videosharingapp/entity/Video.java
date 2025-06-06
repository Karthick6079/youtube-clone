package com.karthick.videosharingapp.entity;

import com.karthick.videosharingapp.enums.VideoStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Set;
import java.util.concurrent.atomic.AtomicLong;

@Document("videos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Video {

    @Id
    private String id;
    private String title;
    private String description;
    private String userId;
    private AtomicLong likes = new AtomicLong(0);
    private AtomicLong dislikes = new AtomicLong(0);
    private Set<String> tags;
    private VideoStatus status;
    private String videoUrl;
    private String thumbnailUrl;
//    private List<Comment> commentList = new CopyOnWriteArrayList<>();
    private AtomicLong views = new AtomicLong(0);
    private Instant createdAt;
    private Instant publishedAt;

    public void increaseviews(){
        this.getViews().incrementAndGet();
    }

    public void incrementLikeCount(){
        this.getLikes().incrementAndGet();
    }

    public void decrementLikeCount(){
        this.getLikes().decrementAndGet();
    }

    public void incrementDisLikeCount(){
        this.getDislikes().incrementAndGet();
    }

    public void decrementDisLikeCount(){
        this.getDislikes().decrementAndGet();
    }

//    public void addComment(Comment comment) {
//        commentList.add(comment);
//    }

}
