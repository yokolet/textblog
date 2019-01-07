# OAuth Using GraphQL

This document explains steps to authenticate users by OAuth on GraphQL.

Before trying steps of this document, OAuth provider setting should be completed and tested.
Read [Setting Up Facebook Login](./SettingUpFacebookLogin.md) to learn how to setup
OAuth by Facebook.


1. Install gems

    - Add `devise` and `omniauth-facebook` gems
        ```ruby
        # OAuth
        gem 'devise', '~> 4.5'
        gem 'omniauth-facebook', '~> 5.0'
        ```
    - Add `dotenv-rails` in develoment/test section
        ```ruby
        group :development, :test do
          # Call 'byebug' anywhere in the code to stop execution and get a debugger console
          gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
          ....
          ....
          gem 'dotenv-rails', '~> 2.5'
        end
        ```
    - Run `bundle install`

2. Setup `devise`

    Do below to setup `devise`.
    
    - `rails g devise:install`
    - `rails g devise User`
    - Comment out `# t.string :email, null: false, default: ""` since
      email field exists already.
    - `rails db:migrate`

3. Set Facebook App ID and Secret

    Create `.env` file in the Rails' top directory.
    ```bash
    FB_APP_ID=YOURFACEBOOKAPPID
    FB_APP_SECRET=YOURFACEBOOKAPPSECRET
    ```
    Read [Setting Up Facebook Login](./SettingUpFacebookLogin.md) what to write
    in two env variables.

4. Add configuration to use Facebook as OAuth provider

    Add below in `config/initializers/devise.rb`.
    ```ruby
    config.omniauth :facebook, ENV['FB_APP_ID'], ENV['FB_APP_SECRET']
    ```

5. Add more fields to User model

    After OAuth authentication, Facebook gives token, uid and some more information
    about the user. To save those in the User model, adds fields.
    
    - Create a migration
    ```bash
    rails g migration AddOmniauthToUsers provider:string uid:string token:string token_expires_at:integer
    ```

6. Make the user model omniauthable

    Add `devise :omniauthable, omniauth_providers: [:facebook]` to `app/models/user.rb`.
    ```ruby
    devise :database_authenticatable, :registerable,
           :recoverable, :rememberable, :validatable,
           :omniauthable, omniauth_providers: [:facebook]
    ```
    
    Right after adding above, new paths will be added as well.
    ```bash
    $ rails routes
    ....
    user_facebook_omniauth_authorize GET|POST /users/auth/facebook(.:format)         devise/omniauth_callbacks#passthru
    user_facebook_omniauth_callback GET|POST /users/auth/facebook/callback(.:format) devise/omniauth_callbacks#facebook
    ....
    ```

7. Create callbacks path and controller

    As the `rails routes` command shows, omniauth paths call methods in `devise/omniauth_callbacks`
    controller. To add own implementation, create a new callbacks path and controller.
    
    - Edit `config/routes.rb`
        ```ruby
        devise_for :users, controllers: { omniauth_callbacks: 'users/omniauth_callbacks' }
        ```
        Now the omniauth routes call users/omniauth_callbacks controller's methods
        ```bash
        user_facebook_omniauth_authorize GET|POST /users/auth/facebook(.:format)         users/omniauth_callbacks#passthru
        user_facebook_omniauth_callback GET|POST /users/auth/facebook/callback(.:format) users/omniauth_callbacks#facebook
        ```
    - Create `app/controllers/users/omniauth_callbacks_controller.rb`
    
For now, textblog app got an user authentication feature. Next topic is
about [OAuth on React](./OAuthOnReact.md)
