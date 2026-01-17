package top.mryan2005.template.javabackend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import top.mryan2005.template.javabackend.Pojo.User;
import top.mryan2005.template.javabackend.Pojo.Dto.LoginRequest;
import top.mryan2005.template.javabackend.Pojo.Dto.RegisterRequest;
import top.mryan2005.template.javabackend.Response.ApiResponse;
import top.mryan2005.template.javabackend.Service.UserService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @PostMapping("/register")
    public ApiResponse<User> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.register(request);
            // 不返回密码
            user.setPassword(null);
            return ApiResponse.success("注册成功", user);
        } catch (IllegalArgumentException e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ApiResponse<User> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request);
            // 不返回密码
            user.setPassword(null);
            return ApiResponse.success("登录成功", user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
    
    @GetMapping("/user/{id}")
    public ApiResponse<User> getUserById(@PathVariable Long id) {
        try {
            User user = userService.getUserById(id);
            user.setPassword(null);
            return ApiResponse.success(user);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage());
        }
    }
}
