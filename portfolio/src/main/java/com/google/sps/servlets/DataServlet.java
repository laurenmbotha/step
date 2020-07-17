// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.blobstore.BlobInfo;
import com.google.appengine.api.blobstore.BlobInfoFactory;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.images.ImagesService;
import com.google.appengine.api.images.ImagesServiceFactory;
import com.google.appengine.api.images.ServingUrlOptions;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import com.google.sps.data.Task;
import java.util.Arrays;
import java.util.*;
import com.google.gson.Gson;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@WebServlet("/comment")
public class DataServlet extends HttpServlet { 

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        List<Task> jobs = new ArrayList<>();

        UserService userService = UserServiceFactory.getUserService();
        

        if (userService.isUserLoggedIn()) {
          Query query = new Query("Task").addSort("timestamp", SortDirection.DESCENDING);

          DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
          PreparedQuery results = datastore.prepare(query);

          for (Entity entity : results.asIterable()) {
            long id = entity.getKey().getId();
            String imageUrl = (String) entity.getProperty("image");
            String author = userService.getCurrentUser().getEmail();
            String title = (String) entity.getProperty("title");
            long timestamp = (long) entity.getProperty("timestamp");

            Task task = new Task(author,imageUrl, id, title, timestamp);
            jobs.add(task);
          }
        }
        Gson gson = new Gson();

        response.setContentType("application/json;");
        response.getWriter().println(gson.toJson(jobs));

    }

    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String title = getParameter(request, "comment-input", "");
        String imageUrl = getUploadedFileUrl(request, "image");
        long timestamp = System.currentTimeMillis();
        UserService userService = UserServiceFactory.getUserService();
        if (!userService.isUserLoggedIn()) {
            response.sendRedirect("/shoutbox");
            return;
        }
        String email = userService.getCurrentUser().getEmail();
        
        
        Entity taskEntity = new Entity("Task");
        taskEntity.setProperty("image", imageUrl);
        taskEntity.setProperty("author", email);
        taskEntity.setProperty("title", title);
        taskEntity.setProperty("timestamp", timestamp);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(taskEntity);
        response.sendRedirect("/index.html");
    }
    private String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null) {
            return defaultValue;
        }
        return value;
    }
    private String getUploadedFileUrl(HttpServletRequest request, String formInputElementName) {
        BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(request);
        List<BlobKey> blobKeys = blobs.get("image");

        if (blobKeys == null || blobKeys.isEmpty()) {
        return null;
        }

        BlobKey blobKey = blobKeys.get(0);

        BlobInfo blobInfo = new BlobInfoFactory().loadBlobInfo(blobKey);
        if (blobInfo.getSize() == 0) {
        blobstoreService.delete(blobKey);
        return null;
        }


        // Use ImagesService to get a URL that points to the uploaded file.
        ImagesService imagesService = ImagesServiceFactory.getImagesService();
        ServingUrlOptions options = ServingUrlOptions.Builder.withBlobKey(blobKey);

        // To support running in Google Cloud Shell with AppEngine's devserver, we must use the relative
        // path to the image, rather than the path returned by imagesService which contains a host.
        try {
        URL url = new URL(imagesService.getServingUrl(options));
        return url.getPath();
        } catch (MalformedURLException e) {
        return imagesService.getServingUrl(options);
        }
  }
}


  
 




