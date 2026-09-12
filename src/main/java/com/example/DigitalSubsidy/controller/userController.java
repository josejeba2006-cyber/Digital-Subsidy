package com.example.DigitalSubsidy.controller;

import com.example.DigitalSubsidy.entity.User;
import com.example.DigitalSubsidy.service.userService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class userController {
    @Autowired
    userService service;

    @GetMapping("/users")
    public List<User> Listusers(){

        return service.getallusers();
    }
    @PostMapping("/users")
    public String addUsers(@RequestBody User user){

        return service.addnewUsers(user);
    }
    @GetMapping("/users/{id}")
    public User finduserbyId(@PathVariable long id){

        return service.finduserid(id);
    }
    @DeleteMapping("/users/{id}")
    public String DeleteUserById(@PathVariable long id){

        return service.DeleteIdByUser(id);
    }
    @PutMapping("/users/{id}")
    public User updateUser(
            @PathVariable Long id,
            @RequestBody User user) {

        return service.updateUser(id, user);
    }

}
