# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
user_ids = User.ids
posts = [
    {title: "What's up?",content: "What's going on here? Anything fun?"},
    {title: "Hello World", content: 'This is the first post made by me, so I\'m shouting "Hello World!"'},
    {title: "Hey Universe", content: "Yay! This is my post for the first time. What else are here?"}
]
posts.each_with_index do |post, idx|
  User.find(user_ids[idx]).posts.create(post)
end