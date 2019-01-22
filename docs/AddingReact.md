# Adding React

This document explains steps to add ReactJS.
When all steps in this document are completed, the entire repository will look like this
__[textblog repo](https://github.com/yokolet/textblog/tree/d3a3c57656d2c4cc2eaf082215763cd028bca43e)__
(the repository at this point in the history).


As in the [Getting Started](GettingStarted.md), `node` and `yarn` should be
installed already. Also, this document assumes `--webpack` options was specified
when the app was created.

1. Install React using webpacker

    This command adds JavaScript libraries and simple React code.

    ```bash
    rails webpacker:install:react
    ```

2. Create an entry point for React

    React needs an HTML page to be hooked up. Since this is a Rails app,
    a controller should be added as an entry point.

    ```bash
    rails g controller home index
    ```

3. Make the React entry point a root path

    Views will be rendered by React in this app. The React entry point is only
    HTML to show from Rails. For this reason, make `home#index` root.
    
    Edit `config/routes.rb` and defines a route as in below.
   
    ```ruby
    Rails.application.routes.draw do
     root to: 'home#index'
    end
    ```

4. Create a view

    When React was installed by webpacker, very simple React file was added.
    It is `app/javascript/packs/hello_react.jsx`, which displays the message,
    "Hello React"
    
    To see the output from React, add one line in the `app/views/home/index.html.erb`.
    
    ```ruby
    <%= javascript_pack_tag 'hello_react' %>
    ```

5. Add favicon.ico

    To avoid a resource loading error, add an empty file.
    ```bash
    touch public/favicon.ico
    ```

6. Test React is working

    All were set up. It's time to test React is working.
    
    Start the server by
    
    ```bash
    rails s
    ```
    
    On a browser, request the URL, `http://localhost:3000/`.
    At first, message below should show up on the terminal which Rails is running.
    
    ```bash
    Processing by HomeController#index as HTML
      Rendering home/index.html.erb within layouts/application
    [Webpacker] Compiling…
    [Webpacker] Compiled all packs in [path to top dir]/textblog/public/packs
      Rendered home/index.html.erb within layouts/application (3993.4ms)
    ```

    Once compilation finishes, "Hello React!" will appear on the browser.
    
For now, textblog app was confirmed to work with React. Next topic is
about [Adding GraphQL](./AddingGraphQL.md)
