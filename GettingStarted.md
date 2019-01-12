# Getting Started

### How this app makes its shape

This document explains steps how this Rails app has been created on OSX.
When all steps in this document are completed, the entire repository will look like this
__[textblog repo](https://github.com/yokolet/textblog/tree/a61f504ae7416bbeb2a665b2c0ace9a33d52d5d0)__.


The app uses PostgreSQL as the database and webpacker for React 
on the front end.


1. Install/Update tools

    - Bundler
    
    Nothing to add about bundler since it is de-fact standard library
    management tool in Ruby. The bundler solves dependency well.
    For more information about Bundler, see [https://bundler.io/](https://bundler.io/).
    
    Before start writing a new app code, it's a good idea to update Bundler.
    Try the command below.

    ```bash
    gem update bundler
    ```
    
    - node, yarn
    
    This app uses React on the front end. This means multiple (acually, a lot of)
    JavaScript libraries need to be installed. `yarn` is a relatively new and fast
    package manager for JavaScript.
    
    This app uses the webpack to run React. `node` is for the webpack and
    should be installed as well.
    
    The same as Bundler, it's a good idea to update node and yarn
    if those are already installed but not the latest or good versions.
    Unlike Bundler, there are a couple ways of installing node and yarn,
    for example, `brew` or `nvm`. Make sure to use the same tool as the one those
    were installed. Below is an example by `brew`.

    ```bash
    brew install node yarn
    ```
    
    or
    
    ```bash
    brew upgrade node yarn
    ```

2. Database

    Since this app uses PostgreSQL, make sure PostgreSQL is installed.
    Also, it is the latest or good version. Additionally, make sure PostgreSQL is
    up and running. If PostgreSQL was installed by `brew` and is a brew service,
    below is the way to check.

    ```bash
    # this tells postgresql status which should be green 'started'
    brew services list
    ```

3. Create and app

    As always, hit `rails new` command to create a Rails app.
    This app will use webpacker, RSpec, and PostgreSQL.

    `$ rails new textblog --webpack -T -d postgresql`

4. Create .ruby-version file

    Only if `.ruby-version` is not in the app's top directory,
    create `.ruby-version`. If auto-generated `.ruby-version` has
    no good version, edit the file to use another version.
    Then, check or update the Ruby version in Gemfile accordingly.

    ```bash
    $ cd textblog
    $ echo 2.5.1 > .ruby-version
    ```

5. Add gems for development and test

    1. Edit `Gemfile`

        Add rspec-rails, factory bot, faker, shoulda and databse_cleaner
        gems to development and test block in `Gemfile`.

        ```ruby
        group :development, :test do
          # Call 'byebug' anywhere in the code to stop execution and get a debugger console
          gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
          gem 'database_cleaner', '~> 1.7'
          gem 'factory_bot_rails', '~> 4.11', '>= 4.11.1'
          gem 'faker', '~> 1.9', '>= 1.9.1'
          gem 'rspec-rails', '~> 3.8'
          gem 'shoulda-matchers', '~> 3.1', '>= 3.1.2'
        end
        ```

    2. Install gems
    
        Install gems added to the Gemfile.

        ```
        bundle install
        ```

6. Initialize rspec

    This app doesn't have test related files since `-T` option was
    specified at the creation. To use RSpec, initialize it.

    ```bash
    $ rails g rspec:install
    Running via Spring preloader in process 71822
          create  .rspec
          create  spec
          create  spec/spec_helper.rb
          create  spec/rails_helper.rb
    ```

    Then, add `.rspec` to `.gitignore` not to push `.rspec` to a repo.

7. Configure testing gems

    Edit `spec/rails_helper.rb` to configure gems.

    1. Database Cleaner
    
        ```
        # Add additional requires below this line. Rails is not loaded until this point!
        require 'database_cleaner'
        
        config.use_transactional_fixtures = false
        
        config.before(:suite) do
          DatabaseCleaner.strategy = :transaction
          DatabaseCleaner.clean_with(:truncation)
        end
        
        config.around(:each) do |example|
          DatabaseCleaner.cleaning do
           example.run
          end
        end
        ```

    2. Factory Bot
    
        ```
        # Factory Bot configuration
        config.include FactoryBot::Syntax::Methods
        ```
     
    3. Shoulda Matchers
    
        ```
        Shoulda::Matchers.configure do |config|
          config.integrate do |with|
            with.test_framework :rspec
            with.library :rails
          end
        end
        ```

8. Setup databases

    `$ rails db:setup`
    
    If PostgreSQL is up and running, no need to create database manually.
    Above command takes care of all including database creation.

    Check whether databases were created by `psql` command.
    
    ```
    $ psql postgres
    postgres=# \l
    ```

    The textblog_development and textblog_test databases should show up.

9. Create a `user` model

    The first model is a user. To make things simple, the user has only name and
    email at this moment.

    1. Generate a model
    
        ```rails g model user name email```
    
    2. Migrate it
    
        ```rails db:migrate```

10. Seed user data

    The user model has been created and migrated, so it's time to seed some data.
    
    1. Add seed data to `db/seed.rb`
    
        ```ruby
        User.create(name: 'Luke', email: 'luke@example.com')
        User.create(name: 'Gandalf', email: 'gandalf@example.com')
        ```
    
    2. Run the command to create data on PostgreSQL
    
        ```rails db:seed```
    
    3. Check it
    
        Use Rails console to see the data was actually created.
    
        ```bash
        $ rails c
        
        irb(main):001:0> User.all
        ```

        Two users should appear in the `User.all` result.

14. Write user model spec, 

    No need to say, but people don't use Rails console to test models while
    development. This app uses RSpec, so write a user spec and run it.
    
    1. Write specs in `spec/models/user_spec.rb`

        ```ruby
        require 'rails_helper'
        
        RSpec.describe Api::V1::Post, type: :model do
          it { should validate_presence_of(:subject) }
          it { should validate_presence_of(:content) }
        end
        ```

    2. Run models spec
    
        ```bash
        rails spec:models
        ```

        Above test fails since the model doesn't have any clue to
        validate presences.
    
    3. Add validates_presense_of in `app/models/user.rb`

        ```ruby
        class User < ApplicationRecord
          # validation
          validates_presence_of :name, :email
        end
        ```

    4. Run models spec again

        ```bash
        rails spec:models
        ```

        Now, it should pass.


For now, textblog app was confirmed to work using very basic specs. Next topic is
about [Adding React](./AddingReact.md)
