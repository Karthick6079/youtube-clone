package com.karthick.youtubeclone.entity;


import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document("subscriptions")
@Getter
@Setter
@RequiredArgsConstructor
public class Subscription {
    @Id
    private String id;

    private String userId;

    private String subscriptionUserId;

    private LocalDateTime subscriptionOn;
}
