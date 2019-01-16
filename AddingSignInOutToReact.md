# Integrating OAuth and GraphQL to React

This document explains steps to make GraphQL query on ReactJS which needs
OAuth authentication (token based authentication).
When all steps in this document are completed, the entire repository will look like this
__[textblog repo]()__

This document assumes following three are already completed.
- OAuth by Facebook is setup and works (see [Setting Up Facebook Login](./SettingUpFacebookLogin.md))
- React client can get OAuth access token from Facebook and print to JavaScript console
(see [Using OAuth On GraphQL](./UsingOAuthOnGraphQL.md))
- On Insomnia (GraphQL IDE), user's information can be pulled using access token
(see [Using OAuth On GraphQL](./UsingOAuthOnGraphQL.md), also)

1. a

2. b    
    
For now, textblog app was confirmed to manage User sign up. Also, the app can show
a list of posts. Next topic is about [Testing GraphQL](./TestingGraphQL.md)
