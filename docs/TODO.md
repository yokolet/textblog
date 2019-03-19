# TODOs

- post model --- DONE
    - limit size of title to 50 --- DONE
        - migration
        - model constrain
        - spec
    - limit size of content --- DONE
        - (no migration, text is unlimited length type)
        - model constrain
        - spec
    - null: false to both title and content --- DONE
        - migration
- user model --- DONE
    - rethink user model --- check React side --- DONE
        - client sends provider and uid --- weird, deleted --- DONE
        - server returns status isAuthenticated --- no need --- DONE
        - server does return user's id (id in Rails) --- DONE
        - graphql user query returns id, provider, name and posts, that's all --- DONE
- user sign out --- DONE
    - add gql? --- no, nothing helps on server side --- DONE
    - when user signed out, delete user and provider from redux store --- DONE
    - when user signed out, isAuthenticated to false, delete user --- DONE
- graphql controller
    - validate values of title and content
        - no HTML tag --> replace all < and > to &lt; and &gt; --> Helper --- DONE
        - no SQL affect strings, SQL Injection (SQLi) --> probably ok for now,
        moved to another topic --- DONE
        - should keep '\n's, spaces  ---> not sure ---> looks OK --- DONE
        - spec
- create post GraphQL --- DONE
    - mutation
        - content length validation? --- DONE
        since text can't have a limit by DB definition ---> should be done in controller
        - in mutation resovle, check title and content length before escaping --- DONE
        - create post spec --- DONE
- new post page by React --- DONE
    - add + (plus) button on top page --- DONE
    - check user is authenticated,  if not, show warning --- DONE
    - new post will be added to postList in redux store --- DONE
    - optimistic update
    - show form --- DONE
- post list --- DONE
    - excerpt --- DONE
        - count lines and show top n lines
        - before excerpt, needs to work on css stuff, card is ugly
        - needs better excerpt, (short line + line feed) * n looks ugly
- show single post page -> CRUD --- DONE
    - the page shows full content
- edit post page by React --- DONE
    - post id, title, content, user id? -> no user id, provider and access_token
    - needs to check whose post - post id and user id
- delete post --- DONE
    - still top page is weird ---> Issues
- fix post list after add/delete/update post --- DONE
    - goes back to top page
    - change cur page to 1
    - make query to get post list for page 1
    - make query to pagination, # of pages may have changed
- 404 page --- DONE
- improve top page --- DONE
    - add post list to redux store. --- DONE
    - optimistic query works? for update? --> Issues
    - pagination --- DONE
    - sort in chronological order, newer to older --- DONE
- Signed In state fix --- DONE
    - keep it in localstorage --- DONE
    - reload keeps signed in state --- DONE
    - sign out deletes from localStorage also --- DONE
    - when auth error comes back from server, handle it --- DONE
        - change user status to signed out --- DONE
        - needs error code from server --- DONE
- improve design
    - media query
    - error message
- comment model --- DONE
- up/down vote
    - vote has a count
    - vote belongs to a user
    - vote belongs to a post
    - one up/down vote for each user - graphql schema
    1. define model
    2. define graphql schema
- support one more OAuth
- check SQLi
- add some specific user's page to list all posts of that user, provider
    - when multiple OAuth providers are supported, the same name may exist.
    - provider and name will be a way to identify who the user is.

- parameter tuning
    - chars in content
    - per page post

- constants
    - extract constants such as title/content length and put all together in
    some file
    - error code


- Photo credit
    - frosted: https://www.flickr.com/photos/mibby23/16047650247/

- Font
    - Fira Mono - Google Fonts , monospace for no Google Fonts

- Issues
    - optimistic query -> refetchQuery dones't work --> it is working --- DONE
        - the problem was how to get refetched data. componentDidUpdate method
        catches that
        - for pagination, it needs fetchMore. it is working
    - needs to update post list and pagination after add/delete post --- DONE
    - documenting in a code