package com.karthick.videosharingapp.config.aws;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
@Profile("local")
public class AwsS3ConfigLocal {

    @Value("${spring.cloud.aws.region}")
    private String region;

    @Value("${spring.cloud.aws.profile}")
    private String profile;


    @Bean
    public S3Client createS3beanLocal(){
        return S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(ProfileCredentialsProvider.create(profile))
                .build();
    }

}
