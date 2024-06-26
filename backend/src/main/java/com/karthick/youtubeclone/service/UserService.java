package com.karthick.youtubeclone.service;


import com.karthick.youtubeclone.dto.UserDTO;
import com.karthick.youtubeclone.entity.Subscriber;
import com.karthick.youtubeclone.entity.Subscription;
import com.karthick.youtubeclone.entity.User;
import com.karthick.youtubeclone.repository.SubscriberRepo;
import com.karthick.youtubeclone.repository.SubscriptionRepo;
import com.karthick.youtubeclone.repository.UserRepository;
import com.karthick.youtubeclone.servicelogic.UserLogic;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    @Value("${spring.auth.user-info-endpoint}")
    private String userInfoEndpoint;

    private final UserRepository userRepository;

    private final ModelMapper mapper;

    private final UserLogic userLogic;

    private final SubscriberRepo subscriberRepo;

    private final SubscriptionRepo subscriptionRepo;

    private final String ANONYMOUS_USER = "anonymousUser";


    public UserDTO registerUser(Jwt jwt) {
        User user;
        user = getUserFromDB(jwt.getSubject());
        if (user != null) {
            removeSubscriberDetailsFromUser(user);
            return convertUsertoUserDto(user, mapper);
        }

        // Get User information from auth provider using jwt token
        user = getUserInfoFromAuthProvider(jwt);
        User savedUser = userRepository.save(user);
        removeSubscriberDetailsFromUser(savedUser);
        return convertUsertoUserDto(savedUser, mapper);
    }


    private void removeSubscriberDetailsFromUser(User user){

        user.setSubscribedToUsers(null);
        user.setSubscribers(null);
    }

    private User getUserInfoFromAuthProvider(Jwt jwt) {
        User user;
        RestClient restClient = RestClient.create();
        try {
            user = restClient.get()
                    .uri(userInfoEndpoint)
                    .header("Authorization", "Bearer " + jwt.getTokenValue())
                    .retrieve().body(User.class);
        } catch (Exception exp) {
            throw new RuntimeException("Exception occurred while registering the user");
        }
        return user;
    }

    public UserDTO getUserProfileInformation() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User savedUser = getUserFromDB(jwt.getSubject());

        return convertUsertoUserDto(savedUser, mapper);
    }

    public UserDTO convertUsertoUserDto(User user, ModelMapper mapper) {
        if (mapper.getTypeMap(User.class, UserDTO.class) == null) {
            TypeMap<User, UserDTO> typeMapper = mapper.createTypeMap(User.class, UserDTO.class);
            typeMapper.addMapping(User::getGivenName, UserDTO::setFirstName);
            typeMapper.addMapping(User::getFamilyName, UserDTO::setLastName);
        }
        return mapper.map(user, UserDTO.class);
    }

    public User getCurrentUser() {
        SecurityContext securityContext = SecurityContextHolder.getContext();

        if(securityContext != null && ANONYMOUS_USER.equals(securityContext.getAuthentication().getPrincipal())){
            return null;
        }

        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return getUserFromDB(jwt.getSubject());
    }

    public User getUserFromDB(String sub) {
        Optional<User> userOp = userRepository.findBySub(sub);
        return userOp.orElse(null);
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User cannot find using id - " + userId));
    }

    public void saveUser(User user) {
        userRepository.save(user);
    }

    public Map<String, Object> subscribe(String userId) {
        User currentUser = getCurrentUser();
        User subscribeToUser = getUserById(userId);

        userLogic.subscribe(currentUser, subscribeToUser);
        userRepository.saveAll(Arrays.asList(currentUser, subscribeToUser));

        UserDTO currentUserDTO = mapper.map(currentUser, UserDTO.class);
        Map<String, Object> returnMap = new LinkedHashMap<>();
        returnMap.put("currentUser", currentUserDTO);
        returnMap.put("videoUploadedSubscribersCount", subscribeToUser.getSubscribersCount());

        return returnMap;
    }



    public Map<String, Object> unsubscribe(String userId) {
        User currentUser = getCurrentUser();
        User unsubscribeToUser = getUserById(userId);

        userLogic.unsubscribe(currentUser, unsubscribeToUser);
        userRepository.saveAll(Arrays.asList(currentUser, unsubscribeToUser));

        UserDTO currentUserDTO = mapper.map(currentUser, UserDTO.class);
        Map<String, Object> returnMap = new LinkedHashMap<>();
        returnMap.put("currentUser", currentUserDTO);
        returnMap.put("videoUploadedSubscribersCount", unsubscribeToUser.getSubscribersCount());
        return returnMap;
    }

}
