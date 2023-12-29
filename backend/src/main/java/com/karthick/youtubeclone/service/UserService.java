package com.karthick.youtubeclone.service;


import com.karthick.youtubeclone.dto.UserDTO;
import com.karthick.youtubeclone.entity.User;
import com.karthick.youtubeclone.repository.UserRepository;
import com.karthick.youtubeclone.servicelogic.UserLogic;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${spring.auth.user-info-endpoint}")
    private String userInfoEndpoint;

    private final UserRepository userRepository;

    private final ModelMapper mapper;

    private final UserLogic userLogic;


    public UserDTO registerUser(String token){
        User user = null;

        // Get User information from auth provider using jwt token
        RestClient restClient = RestClient.create();
        try{
             user = restClient.get()
                     .uri(userInfoEndpoint)
                    .header("Authorization", "Bearer " + token)
                    .retrieve().body(User.class);
        } catch (Exception exp){
            throw new RuntimeException("Exception occurred while registering the user");
        }

        assert user != null;
       User savedUser =  userRepository.save(user);
       return convertUsertoUserDto(savedUser);
    }

    public UserDTO getUserProfileInformation(){
       Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

       User savedUser = getUserFromDB(jwt.getSubject());

       return convertUsertoUserDto(savedUser);
    }

    private UserDTO convertUsertoUserDto(User user){
        if(this.mapper.getTypeMap(User.class, UserDTO.class) == null){
            TypeMap<User, UserDTO> typeMapper = this.mapper.createTypeMap(User.class, UserDTO.class);
            typeMapper.addMapping(User::getGivenName, UserDTO::setFirstName);
            typeMapper.addMapping(User::getFamilyName, UserDTO::setLastName);
        }
        return mapper.map(user, UserDTO.class);
    }

    public User getCurrentUser(){
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return getUserFromDB(jwt.getSubject());
    }

    public User getUserFromDB(String sub){
        return userRepository.findBySub(sub)
                .orElseThrow(() -> new RuntimeException("User cannot find using sub - " + sub));
    }

    public User getUserById(String userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User cannot find using id - " + userId));
    }

    public void saveUser(User user){
        userRepository.save(user);
    }

    public void subscribe(String userId) {
        User currentUser = getCurrentUser();
        User subscribeToUser = getUserById(userId);

        userLogic.subscribe(currentUser, subscribeToUser);

        userRepository.saveAll(Arrays.asList(currentUser, subscribeToUser));
    }
    public void unsubscribe(String userId) {
        User currentUser = getCurrentUser();
        User unsubscribeToUser = getUserById(userId);

        userLogic.unsubscribe(currentUser, unsubscribeToUser);

        userRepository.saveAll(Arrays.asList(currentUser, unsubscribeToUser));
    }

    public void addToWatchHistory(String videoId){
        User user = getCurrentUser();
        user.addToVideoHistory(videoId);
        userRepository.save(user);
    }

}
