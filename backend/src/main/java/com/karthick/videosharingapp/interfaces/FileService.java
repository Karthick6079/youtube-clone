package com.karthick.videosharingapp.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {

    public String uploadFile (MultipartFile file, String folder) ;
}
