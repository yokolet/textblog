# README

* What is this

This is a text only blog application. People can see posts and comments.
If you sign in, you can add a new post and comment.
If the post is your own, you can edit and delete the post.
If the comment is your own, you can delete the comment.

* App structure

This app consists of two parts, the server side and client side.
The server side is by GraphQL gem, Rails, and PostgreSQL.
The client side is by React/Redux, Apollo.
This app uses Rails' webpacker feature, so it doesn't need a client side server.

User authentication is done by OAuth, social login.
This app uses a client side OAuth flow.
ReactJS component connects to social login OAuth provider and gets an access token.
The access token is passed to the server attached to Authorization HTTP header when
people do the actions of add, edit, delete. The access token is used to
find who you are. Other than those actions, say, just looking at posts,
user authentication is not required.

Communication between server and client is done by GraphQL.
Apollo is a package for ReactJS to send/receive GraphQL request/response.

* Documents

    The early stage of step by step development details are described in the
    documents below.

    1. [Getting Started](./docs/GettingStarted.md)
    2. [Adding React](./docs/AddingReact.md)
    3. [Adding GraphQL](./docs/AddingGraphQL.md)
    4. [Using GraphQL from React](./docs/UsingGraphQLfromReact.md)
    5. [Setting Up Facebook Login](./docs/SettingUpFacebookLogin.md)
    6. [Adding OAuth](./docs/AddingOAuth.md)
    7. [Using OAuth on GraphQL](./docs/UsingOAuthOnGraphQL.md)
    8. [Creating Top Page](./docs/CreatingTopPage.md)
    9. [Adding Sign In to React](./docs/AddingSignInToReact.md)
    10. [Connecting React Sign In to GraphQL](./docs/ConnectingReactSignInToGraphQL.md)
    11. [Testing GraphQL](./docs/TestingGraphQL.md)
    12. [Testing React and Redux](./docs/TestingReactAndRedux.md)

        The app now may be very different from explanation in the docs.
        After the twelfth document, the app got a lot of improvements and new features.

* Versions
    * Ruby/Rails: 2.5.1/5.2.2
    * node/yarn: v11.6.0/1.13.0
    * PostgreSQL: stable 11.1

* How to run the app

    1. `bundle install`

    2. `rails db:migrate`

    3. `yarn install`

    4. `rails s`

    5. Go to http://localhost:3000/

* How to run the test suite

    - `rails spec`

    - `yarn spec -u`

* Demo site

    The app is live at:

        https://desolate-fortress-64943.herokuapp.com/

    It may take a while to start up.
