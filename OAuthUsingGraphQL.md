# OAuth Using GraphQL

This document explains steps to authenticate users by OAuth on GraphQL.

Before trying steps of this document, OAuth provider setting should be completed and tested.
Read [Setting Up Facebook Login](./SettingUpFacebookLogin.md) to learn how to setup
OAuth by Facebook.


1. Install gems

    - Add `devise` and `omniauth-facebook` gem
    - Add `dotenv-rails` in develoment/test section
    - `bundle install`

2. Setup `devise`

    - rails g devise:install
    - rails g devise User
    - rails db:migrate

    
For now, textblog app got an user authentication feature. Next topic is
about [OAuth on React](./OAuthOnReact.md)
