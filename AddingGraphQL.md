# Adding GraphQL

This document explains steps to add GraphQL and Use it.
As in the [Getting Started](GettingStarted.md), `user` model and seed data
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

    GraphQL uses a schema to define model, query and create/update/delete.
    The first thing to use GraphQL is to define schema. Here begins with defining
    User schema.
    
    1. Generate a schema file
    
        The command below adds a file `app/graphql/types/user_type.rb`

        ```bash
        rails g graphql:object user
        ```
    
    2. Edit `user_type.rb`

        This file's structure is similar to the users definition in `db/schema.rb`.
        The `!` added to the beginning of type names mean the field is required.
    
        ```ruby
        Types::UserType = GraphQL::ObjectType.define do
          name "User"
        
          field :id, !Types.ID
          field :name, !Types.String
          field :email, !Types.String
        end
        ```

3. Define query schema

    GraphQL defines a schema for queries. The query takes care of Rails' index and show
    methods. Edit `app/graphql/types/query_type.rb` as in blow.
    
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

    ```rails s```
    
    `http://localhost:3000/graphiql`
    
    ```
    {
      allUsers {
        id
        name
        email
      }
    }
 
    {
      user(id: 2) {
        id
        name
        email
      }
    }
    ```

    
For now, textblog app was confirmed to work with GraphQL. Next topic is
about [Adding GraphQL](./AddingGraphQL.md)
