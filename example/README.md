# What is this Sinatra App

This Sinatra app is for testing Facebook Login.
Read [SettingUpFacebookLogin.md](../SettingUpFacebookLogin.md) for a detail.

### To Run this Sinatra app

1. Create `.env` file in the same directory as Sinatra's `config.ru` file.

    ```bash
    FB_APP_ID=YOURAPPID
    FB_APP_SECRET=YOURAPPSECRET
    ``` 

2. Start the app

    ```bash
    rackup -p 3000
    ```