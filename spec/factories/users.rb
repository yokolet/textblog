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
