# Adding GraphQL

This document explains steps to add GraphQL and how to use it.
When all steps in this document are completed, the entire repository will look like
the repository at this point in the history [
[__github__](https://github.com/yokolet/textblog/tree/06a62e49cb5f85d50a31c835a594c77e550692bf)
|
[__gitlab__](https://gitlab.com/yokolet/textblog/tree/06a62e49cb5f85d50a31c835a594c77e550692bf)
].

As in the [Getting Started](./GettingStarted.md), `user` model and seed data
should be added already. Those will be used here.

1. Install GraphQL

    The most common way to add GraphQL to Rails is to add graphql gem.
    While communicating over GraphQL, a server should have GraphQL schema
    and parse the request based on the schema.
    
    The graphql gem generates schema templates and adds a controller as an
    endpoint of GraphQL queries. Additionally, the gem adds development
    environment, `graphiql-rails`. It provides a graphical tool to test
    GraphQL queries.
    
    1. Add gem in `Gemfile` 

        ```ruby
        # Use GraphQL for communication between Rails and React
        gem 'graphql', '~> 1.8', '>= 1.8.11'
        ```
        
    2. Install gem

        ```
        bundle install
        ```
    
    3. Install graphql gem
    
        ```rails g graphql:install```
    
    4. Install graphiql-rails
    
        When the command above gets run, graphiql-rails gem is added to Gemfile.
        To install the gem run again:
        
        ```bundle install```

2. Create User schema

    GraphQL uses a schema to define a model, query and mutation(create/update/destroy).
    The first thing to use GraphQL is to define a schema. Here begins with the
    User schema.
    
    1. Generate a schema file
    
        The command below adds a file `app/graphql/types/user_type.rb`

        ```bash
        rails g graphql:object user
        ```
    
    2. Edit `user_type.rb`

        This file's structure is similar to the users definition in `db/schema.rb`.
        The `!` added to the beginning of a type name means the field is required.
    
        ```ruby
        Types::UserType = GraphQL::ObjectType.define do
          name "User"
        
          field :id, !Types.ID
          field :name, !Types.String
          field :email, !Types.String
        end
        ```

3. Define query schema

    GraphQL defines a schema for queries as well. The query takes care of what Rails'
    index and show methods do. For example, getting all users or a
    particular user are done by query.
    Edit `app/graphql/types/query_type.rb` as in blow.
    
    ```ruby
    Types::QueryType = GraphQL::ObjectType.define do
      name "Query"
    
      field :allUsers do
        type types[Types::UserType]
        description "returns a list of all users"
        resolve -> (obj, args, ctx) {
          User.all
        }
      end
    
      field :user do
        type Types::UserType
        description "returns a user"
        argument :id, !types.ID
        resolve -> (obj, args, ctx) {
          User.find(args[:id])
        }
      end
    end
    ```

4. Test queries on GraphiQL

    Once User and query schemas are ready, GraphQL queries can be tested on GraphiQL.
    GraphiQL provides a UI to test GraphQL queries and mutations. It is installed during
    graphql gem installation.

    1. Start Rails
    
        `rails s`

    2. Open browser and go to:
    
        `http://localhost:3000/graphiql`

    3. Write a query below on the left pane and click an arrow button on the top. The result
        should show up on the right pane.

        This query sets all fields the User model has. However, what to write is your choice.
        Only id or email works.

        ```
        query {
          allUsers {
            id
            name
            email
          }
        }
        ```

    4. Write another query to get a single user. Again, write a query on the left pane and
        click the arrow button on the top. The result will be on the right pane.

        ```
        query {
          user(id: 2) {
            id
            name
            email
          }
        }
        ```

5. Define mutation schema

    The same as query, GraphQL defines a schema for mutations. The mutation takes care of what
    Rails' create, update and destroy methods do.
    Edit `app/graphql/types/mutation_type.rb` as in blow.
    
    ```ruby
    Types::MutationType = GraphQL::ObjectType.define do
      name "Mutation"
    
      field :createUser, Types::UserType do
        argument :name, !types.String
        argument :email, !types.String
        resolve -> (obj, args, ctx) {
          User.create(name: args[:name], email: args[:email])
        }
      end
    
      field :updateUser, Types::UserType do
        argument :id, !types.ID
        argument :name, types.String
        argument :email, types.String
        resolve -> (obj, args, ctx) {
          user = User.find(args[:id])
          user.update!(args.to_h)
          user
        }
      end
    
      field :destroyUser, Types::UserType do
        argument :id, !types.ID
        resolve -> (obj, args, ctx) {
          User.find(args[:id]).destroy!
          nil
        }
      end
    end
    ```

6. Test mutations on GraphiQL

    1. Start Rails
        
            `rails s`
    
    2. Open browser and go to:
    
        `http://localhost:3000/graphiql`

    3. Create a user
    
        Write a query below on the left pane and click an arrow button on the top. The result
        should show up on the right pane.

        ```
        mutation {
          createUser(name: "ET", email: "et@example.com") {
            id
            name
            email
          }
        }
        ```

    4. Update the user
    
        ```
        mutation {
          updateUser(id: 3, email: "etet@example.com") {
            id
            name
            email
          } 
        }
        ```

    5. Delete the user

        ```
        mutation {
        	destroyUser(id: 3) {
            id
          }
        }
        ```

7. Versioning

    GraphQL doesn't have the idea of versioning like RESTful API.
    GraphQL abandoned the idea of versioning since a client decides what it needs.
    GraphQL Best Practices explains about
    the [Versioning](https://graphql.org/learn/best-practices/#versioning).
    
For now, textblog app was confirmed to work with GraphQL. Next topic is
about [Using GraphQL from React](./UsingGraphQLfromReact.md)
