# Privacy policy

This document explains what information this site collects and how it will be used.

### What will be collected

1. OAuth provider name and user id on that provider

    These two are keys to identify the user. The provider name is exposed to
    the public, but the user id isn't. The user id is only for a internal use.

2. Name

    This site gets your name from the data OAuth provider returns. The name
    is saved in this site and used on post list and a single post views.

3. Email

    The same as your name, the email is one of the data OAuth provider returns.
    The email is saved in this site, but never exposed to the public.

4. Access Token

    The access token is given to you from OAuth provider when authentication is
    completed. It expires within some time span that OAuth provider sets. This site
    uses the access token to find who you are. The access token is never exposed to
    the public.

### What will not be collected

1. Password

    This site uses a client side OAuth flow. Your OAuth provider password never comes
    to this site. OAuth authentication will be completed between you and OAuth provider.
