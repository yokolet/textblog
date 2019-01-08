# Adding OAuth

This document explains steps to authenticate users by OAuth using Facebook as OAuth provider.

Before trying steps of this document, OAuth provider setting should be completed and tested.
Read [Setting Up Facebook Login](./SettingUpFacebookLogin.md) to learn how to setup
OAuth by Facebook.

This document focuses only on Rails side. Later, (by the next document),
OAuth with GraphQL will be described.

1. Install OAuth related gems

    Typical gems for Rails to provide OAuth feature is `omniauth`, which works with `devise`.
    Not to expose Facebook APP ID and Secret, `dotenv-rails` gem is used, but only for
    development and test. When the app is deployed on cloud, such as Heroku,
    a cloud specific way of setting environment variables exists.
    
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

    Do below to setup `devise`. This is a common ritual to start using `devise`.
    The command below assumes User model is already there. In this app, the model
    was created while going over [Getting Started](./GettingStarted.md).

    - `rails g devise:install`
    - `rails g devise User`
    
    Before running migration, `email` line should be commented out since it is
    there.
    
    - Comment out the line `# t.string :email, null: false, default: ""` 
    - `rails db:migrate`

3. Set Facebook App ID and Secret

    Create `.env` file in the Rails' top directory.
    ```bash
    FB_APP_ID=YOURFACEBOOKAPPID
    FB_APP_SECRET=YOURFACEBOOKAPPSECRET
    ```
    Read [Setting Up Facebook Login](./SettingUpFacebookLogin.md) what to write
    in two env variables.
    
    Don't forget to add `.env` in `.gitignore`.

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
    - `rails db:migrate`

6. Make the user model omniauthable

    Add `devise :omniauthable, omniauth_providers: [:facebook]` to `app/models/user.rb`.
    ```ruby
    devise :database_authenticatable, :registerable,
           :recoverable, :rememberable, :validatable,
           :omniauthable, omniauth_providers: [:facebook]
    ```

    Right after adding above, new paths for OAuth wil be added.
    ```bash
    $ rails routes
    ....
    user_facebook_omniauth_authorize GET|POST /users/auth/facebook(.:format)         devise/omniauth_callbacks#passthru
    user_facebook_omniauth_callback GET|POST /users/auth/facebook/callback(.:format) devise/omniauth_callbacks#facebook
    ....
    ```

7. Create callbacks path and controller

    As the `rails routes` command shows, omniauth paths call methods in `devise/omniauth_callbacks`
    controller. To add own implementation, create a new callback path and controller.

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
    
        The class should be a subclass of `Devise::OmniauthCallbacksController`
        ```ruby
        class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
          def facebook
            callback_for(:facebook)
          end
        
          def failure
            redirect_to root_path
          end
        
          private
          def callback_for(provider)
            user = User.from_omniauth(request.env["omniauth.auth"])
            sign_in_and_redirect user, event: :authentication if user.persisted?
          end
        end
        ```
    - Add callback method, `from_omniauth`, in `app/models/user.rb`
        When the callback method in the controller gets invoked,
        User model's `from_omniauth` will be called and return a User instance.

        The `password` field is not apparent as far as looking at schema and model
        definition. However, `devise` requires to set some value as the password.
        It is OAuth authentication, so this app never receives users' password.
        A good value would be `Devise.friendly_token[0,20]`.
        
        ```ruby
        class User < ApplicationRecord
          # Include default devise modules. Others available are:
          # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
          devise :database_authenticatable, :registerable,
                 :recoverable, :rememberable, :validatable,
                 :omniauthable, omniauth_providers: [:facebook]
          # validation
          validates_presence_of :name, :email
        
          def self.from_omniauth(auth)
            where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
              user.email = auth.info.email
              user.name = auth.info.name
              user.token = auth.credentials.token
              user.token_expires_at = auth.credentials.expires_at
              user.password = Devise.friendly_token[0,20]
            end
          end
        end
        ```

8. Update __Valid OAuth Redirect URIs__

    To make OAuth run successfully, double check  __Valid OAuth Redirect URIs__ on
    Facebook Developer website.
    
    ![Client Auth Settings Rails](./docs/images/client_auth_setting_rails.png)
    
    The callback URI should be publicly reachable. For this purpose,
    [__ngrok__](https://ngrok.com/) is used for forwarding.
    Read [Setting Up Facebook Login](./SettingUpFacebookLogin.md) for details.
    
    The callback path is `/users/auth/facebook/callback`, which can be checked
    by `rails routes` command.
    
9. Test in a bare bone way

    Run the app and request OAuth path.
    - `rails s`
    
    On a web browser, hit `http://localhost:3000/users/auth/facebook`.
    
    After OAuth approval sequences, a user will be created. Then, the page is
    redirected to root path.
    
    This app's root page shows a list of users as described in
    [Using GraphQL from React](./UsingGraphQLfromReact.md). A newly created user by OAuth
    will show up.
    
    ![A New User by OAuth](./docs/images/new_user_by_oauth.png)


For now, textblog app got an user authentication feature by Facebook OAuth.
Next topic is about [Using OAuth on GraphQL](./UsingOAuthOnGraphQL.md).
