# Testing GraphQL

This document explains steps to test GraphQL.
When all steps in this document are completed, the entire repository will look like this
__[textblog repo](https://github.com/yokolet/textblog/tree/437338d78ef38d7ee0a623fc61417de15b032afe)__
(the repository at this point in the history).


By now, the Rails server and ReactJS client are getting a shape.
Still just a sample, but those are becoming a real application step by step.
At this moment, something significantly missing compared to a real application is
testing. A couple of types of testings should be done for this app:
ReactJS testing, GraphQL testing and Rails testing.
The first pick is a GraphQL testing.

1. What should be tested by GraphQL testing

    GraphQL is a relatively new addition to Rails. GraphQL testing doesn't
    have a decisive methodology, practice or such yet, while Rails testing is
    well established and mature. From its nature, a static structure testing and
    behavior testing are considered the GraphQL testing. 

    The static structure testing is loosely mapped to Rails' model
    testing. For example, this textblog app has a User type, which
    defines what fields the User type has, say, provider, name, etc.
    Such a static structure should be tested.
    
    The behavior testing is a kind of resovler testing. This is loosely
    mapped to Rails' controller testing. Each field of query and mutation
    types has a resolver method. The resolver defines how to behave.
    For example, `allPosts` field in `query_type.rb` has a resolver
    definition which will return a list of posts.
    This behavior should be tested.

2. Install `rspec-graphql_matchers` gem

    The `rspec-graphql_matchers` gem provides rspec matchers for GraphQL
    testing. Install the gem first.
    
    Open `Gemfile` and add `gem 'rspec-graphql_matchers', '~> 0.7.1'` in
    the development/test section.
    ```ruby
    ....
    ....
    group :development, :test do
      # Call 'byebug' anywhere in the code to stop execution and get a debugger console
      gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
      gem 'database_cleaner', '~> 1.7'
      gem 'factory_bot_rails', '~> 4.11', '>= 4.11.1'
      gem 'faker', '~> 1.9', '>= 1.9.1'
      gem 'rspec-rails', '~> 3.8'
      gem 'shoulda-matchers', '~> 3.1', '>= 3.1.2'
      gem 'rspec-graphql_matchers', '~> 0.7.1'
      gem 'dotenv-rails', '~> 2.5'
    end
    ....
    ....
    ```
    
    ```bash
    bundle install
    ```

3. Static structure testing

    For the first example, let's create a user type spec.
    - Create a directory and file
        ```bash
        mkdir -p spec/graphql/types
        touch spec/graphql/types/user_type_spec.rb
        ``` 
    - Write user specs in `user_type_spec.rb`

        This spec tests each field's existence and type.
        ```ruby
        require 'rails_helper'
        
        RSpec.describe Types::UserType do
          types = GraphQL::Define::TypeDefiner.instance
        
          it 'defines a field id of type ID!' do
            expect(subject).to have_field(:id).that_returns(!types.ID)
          end
        
          it 'defines a field provider of type String!' do
            expect(subject).to have_field(:provider).that_returns(!types.String)
          end
        
          it 'defines a field uid of type ID!' do
            expect(subject).to have_field(:uid).that_returns(!types.ID)
          end
        
          it 'defines a field name of type String!' do
            expect(subject).to have_field(:name).that_returns(!types.String)
          end
        
          it 'defines a field email of type String!' do
            expect(subject).to have_field(:email).that_returns(!types.String)
          end
        
          it 'defines a field posts of type [Types::PostType]' do
            expect(subject).to have_field(:posts).that_returns(types[Types::PostType])
          end
        end
        ```
    - Add post type spec

        Exactly in the same manner, add post_type_spec.rb

    - Run the spec

        This is a normal rspec testing, so run the spec as in below:
        ```bash
        rspec spec/graphql/types
        ```

4. Refactoring

    Before going toward to the resolver testing, let's do a bit of refactoring.
    At this moment, all queries to both User and Post types are written in
    the same file. It's ok for just a sample app. However, to make this textblog
    app more realistic, That's not a good idea. It's easily to imagine
    the number of GraphQL query definitions grow bigger. There may be other
    types of queries will be added. The `query_type.rb` file will be clutter.
    So will the spec file.
    
    In this occasion, let's do a bit of refactoring so that each definition
    to reside in a meaningful file.
    
    - Create a directory and file for a User query type
        ```bash
        mkdir -p app/graphql/queries
        touch app/graphql/queries/user_query_type.rb
        ```

        Extract user queries from `app/graphql/types/query_type.rb` and
        add those to `user_query_type.rb`.
        ```ruby
        Queries::UserQueryType = GraphQL::ObjectType.define do
          name "UserQueryType"
          description "The User Query Type"
        
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
    - Create a file for a Post query type
        ```bash
        touch app/graphql/queries/post_query_type.rb
        ```
        ```ruby
        Queries::PostQueryType = GraphQL::ObjectType.define do
          name "PostQueryType"
          description "The Post Query Type"
        
          field :allPosts do
            type types[Types::PostType]
            description "returns a list of all posts"
            resolve -> (obj, args, ctx) {
              Post.all
            }
          end
        end
        ```
    - Create an utility module to compose fields

        Since multiple query type files were created, now query fields were
        scattered to multiple files. Those fields should be put together
        to be referenced as a query schema.
        
        To make this happen, create a helper, `Util::FieldComposer`.
        
        ```bash
        mkdir -p app/graphql/util
        touch app/graphql/util/field_composer.rb
        ```
        ```ruby
        module Util
          class FieldComposer
            def self.compose(types)
              ret = types.reduce({}) do |acc, type|
                acc.merge(type.fields)
              end
              ret
            end
          end
        end
        ```
    - Update `query_type.rb`
    
        By changes above, `query_type.rb` gets ready to be updated.
        Open `app/graphql/types/query_type.rb` and edit. The file looks
        like below:
        ```ruby
        Types::QueryType = GraphQL::ObjectType.define do
          name "Query"
          description "Avaiable Queries"
          fields Util::FieldComposer.compose([
              Queries::UserQueryType,
              Queries::PostQueryType])
        end
        ```
    - Go over the same changes on mutations
    
        Do the same refactoring on mutations as well.
        Create `app/graphql/mutations/user_mutation_type.rb` and move
        user type's mutation to this file.
        ```ruby
        Mutations::UserMutationType = GraphQL::ObjectType.define do
          name "UserMutationType"
          description "The User Mutation Type"
        
          field :signInUser, Types::UserType do
            description "User sign in. User's access token should be set to the Authorization header."
            argument :provider, !types.String
            resolve -> (obj, args, ctx) {
              access_token, social_api = ctx[:api][:access_token], ctx[:api][:social_api]
              if access_token.nil?
                raise GraphQL::ExecutionError.new('Authorization request header is missing.')
              end
              if social_api.nil?
                raise GraphQL::ExecutionError.new('Authorization request header is invalid.')
              end
              begin
                me = social_api.get_object('me', {'fields': 'id,name,email'}) # this line may raise error
                User.where(provider: args[:provider], uid: me['id']).first_or_create do |user|
                  user.name = me['name']
                  user.email = me['email']
                end
              rescue => e
                GraphQL::ExecutionError.new(e.message)
              end
            }
          end
        end
        ```
        Then update `app/graphql/types/mutation_type.rb`, which should look like
        below:
        ```ruby
        Types::MutationType = GraphQL::ObjectType.define do
          name "Mutation"
          description "Available Mutations"
        
          fields Util::FieldComposer.compose([Mutations::UserMutationType])
        end
        ```
    - Test the change works fine
    
        Go to http://localhost:3000/graphiql (careful, it is graphiql not graphql).
        Click "Docs" link on the top right.
        
        ![GraphiQL Docs Link](./docs/images/graphiql_docs_link.png)
        
        The Root Type schema shows up.
        
        ![GraphiQL Schema Root](./docs/images/graphiql_schema_root.png)
        
        If "Query" link gets clicked, it shows all available queries at
        this moment.
        
        ![GraphiQL Query Schema](./docs/images/graphiql_query_schema.png)
        
        In the same steps, mutation schemas can be checked.
            
5. Behavior testing - Query

    In this section, GraphQL's behaviors will be tested. The textblog app has
    two types of behaviors: query and mutation types (additionaly,
    GraphQL defines subscription type). For the first behavior testing,
    let's begin with the query.
    
    - Create factories
    
        This Rails app uses `factory_bot` and `faker` gems to create
        factories. Templates for user and post factories were already
        added when user and post models were created by a Rails generator.
        
        Open `spec/factories/users.rb` and edit.
        ```ruby
        FactoryBot.define do
          factory :user do
            provider { 'facebook' }
            uid { Faker::Number.number(10) }
            name { Faker::Name.name }
            email { Faker::Internet.email }
            after :create do |user|
              create_list :post, 2, user: user
            end
          end
        end
        ```
        Next, open `spec/factories/posts.rb` and edit.
        ```ruby
        FactoryBot.define do
          factory :post do
            title { Faker::Lorem.sentence }
            content { Faker::Lorem.paragraph }
            user
          end
        end
        ```
    - Create user query type spec
    
        ```bash
        mkdir -p spec/graphql/queries
        touch spec/graphql/queries/user_query_type_spec.rb
        ```
        The spec for `UserQueryType` will looks like below:
        ```ruby
        require 'rails_helper'
        
        describe Queries::UserQueryType do
          types = GraphQL::Define::TypeDefiner.instance
        
          it 'defines a field allUsers that returns an array of Types::UserType type' do
            expect(subject).to have_a_field(:allUsers).that_returns(types[Types::UserType])
          end
        
          it 'defines a field user that returns Types::UserType type' do
            expect(subject).to have_a_field(:user).that_returns(Types::UserType)
          end
        
          context 'with users' do
            let!(:users) { create_list(:user, 3) }
            let!(:a_user) { users.last }
        
            it 'returns all users' do
              result = subject.fields['allUsers'].resolve(nil, nil, nil)
              expect(result.size).to eq(3)
              expect(result.first.posts.size).to eq(2)
            end
        
            it 'returns a user of id' do
              result = subject.fields['user'].resolve(nil, {id: a_user.id}, nil)
              expect(result.name).to eq(a_user.name)
              expect(result.posts.first.title).to eq(a_user.posts.first.title)
            end
        
            describe 'a query is given' do
              let(:vars) { {} }
              let(:ctx) { {} }
              let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }
        
              context 'to request all user names' do
                let(:query_string) { %|query { allUsers { name } }| }
        
                it 'returns names' do
                  result_names = result["data"]["allUsers"].map { |x| x["name"] }
                  expect(result_names).to match_array(users.map(&:name))
                  result_ids = result["data"]["allUsers"].map { |x| x["id"] }
                  expect(result_ids).to match_array([nil]*3)
                end
              end
        
              context 'to request a single user' do
                let(:vars) { {"id": a_user.id} }
                let(:query_string) {
                  %|query user($id: ID!) {
                      user(id: $id) {
                        name
                        posts {
                          title
                        }
                      }
                    }|
                }
                it 'returns a name and uid' do
                  result_user = result["data"]["user"]
                  expect(result_user["name"]).to eq(a_user.name)
                  expect(result_user["id"]).to be_nil
                  expect(result_user["posts"].first["title"]).to eq(a_user.posts.first.title)
                end
              end
            end
          end
        end
        ```
        In above spec file, three kinds of testing are defined:
        a field existence, resolver result and query result.
        The field test is exactly the same as previous section's testing.
        The resolver test sees the output from the resolver method invocation.
        The test checks resolver is correctly implemented.
        The last one, query test is actually sending out the GraphQL query
        and sees what will be returned. This is a sort of integration test.
        Variables, context are passed along with the query.

    - Create post query type spec
    
        Post query type spec is quite similar to the user query spec.
        Tests are done for fields, resolver and query.
        Create `spec/graphql/queries/post_query_type_spec.rb` which looks
        like below:
        ```ruby
        require 'rails_helper'
        
        describe Queries::PostQueryType do
          types = GraphQL::Define::TypeDefiner.instance
        
          it 'defines a field allPosts that returns an array of Types::PostType type' do
            expect(subject).to have_a_field(:allPosts).that_returns(types[Types::PostType])
          end
        
          context 'with posts' do
            let!(:users) { create_list(:user, 3) } # creates 3 * 2 posts
        
            it 'returns all posts' do
              result = subject.fields['allPosts'].resolve(nil, nil, nil)
              expect(result.size).to eq(6)
              expect(result.first.user.id).to eq(users.first.id)
            end
        
            describe 'a query is given' do
              let(:vars) { {} }
              let(:ctx) { {} }
              let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }
        
              context 'to request all post titles' do
                let(:query_string) { %|query { allPosts { title } }| }
        
                it 'returns titles' do
                  test_titles = users.map(&:posts).reduce([]) { |acc, x| acc + x.map(&:title) }
                  result_titles = result["data"]["allPosts"].map { |x| x["title"] }
                  expect(result_titles).to match_array(test_titles)
                  result_ids = result["data"]["allPosts"].map { |x| x["id"] }
                  expect(result_ids).to match_array([nil]*6)
                end
              end
            end
          end
        end
        ```
    - Run the spec
    
        ```rspec spec/graphql/queries```

6. Behavior testing - Mutation

    The last to be tested is Mutation. This test is quite similar to Query testing.
    So far, textblog app has only one mutation, `signInUser`.
    Let's write specs to test field existence, resolver and mutation query behaviors.
    
    Something not the same as query specs is this mutation test needs to
    stub out one method. Unless, the test actually tries to connect facebook and
    pull out user info. Definitely, this should be avoided since it is a test.
    
    What want to stub out is a social_api calling. In this app, the instance
    is created in `GraphQLHelper#get_social_api` (`app/helpers/graphql_helper.rb`).
    The instance method, `get_object`, is used in `Mutations::UserMutationType`
    (`app/graphql/mutations/user_mutation_type.rb`).
    
    The test below uses `rspec-mocks` gem (already in the dependency).
    ```ruby
    let(:social_api) { double("social_api") }
    allow(social_api).to receive(:get_object).and_return(me)
    ```
    Above are in the spec file.
    
    - Create a directory and file
        ```bash
        mkdir -p spec/graphql/mutations
        touch spec/graphql/mutations/user_mutation_type_spec.rb
        ```
    - Create user mutation type spec
        ```ruby
        require 'rails_helper'
        
        describe Mutations::UserMutationType do
          types = GraphQL::Define::TypeDefiner.instance
        
          it 'defines a field signInUser that returns Types::UserType type' do
            expect(subject).to have_a_field(:signInUser).that_returns(Types::UserType)
          end
        
          context 'with signInUser field' do
            let(:facebook) {Faker::Omniauth.facebook }
            let(:access_token) { facebook[:credentials][:token] }
            let(:me) {
              {
                  "id" => facebook[:uid],
                  "name" => facebook[:info][:name],
                  "email" => facebook[:info][:email]
              }
            }
            let(:social_api) { double("social_api") }
            let(:args) { {provider: 'facebook'} }
            let(:ctx) { {
                api: {
                    access_token: access_token,
                    social_api: social_api
                }
            } }
        
            it 'create or find a user' do
              allow(social_api).to receive(:get_object).and_return(me)
              result = subject.fields['signInUser'].resolve(nil, args, ctx)
              expect(result.id).not_to be_nil
            end
        
            describe 'a mutation is given' do
              let(:vars) { {provider: "facebook"} }
              let(:result) { TextblogSchema.execute(mutate_string, variables: vars, context: ctx) }
        
              context 'to sign in user' do
                let(:mutate_string) { %|mutation SignInUser($provider: String!) { signInUser(provider: $provider) { id uid name } }| }
        
                it 'returns a user info' do
                  allow(social_api).to receive(:get_object).and_return(me)
                  result_user = result["data"]["signInUser"]
                  expect(result_user["id"]).not_to be_nil
                  expect(result_user["uid"]).to eq(me["id"])
                  expect(result_user["name"]).to eq(me["name"])
                end
              end
            end
          end
        end
        ```
    - Run the spec
    
        ```rspec spec/graphql/mutations```

For now, textblog app got a GraphQL testing. Next topic is
about [Testing ReactJS](./TestingReactjS.md).
