FactoryBot.define do
  factory :user do
    provider { 'facebook' }
    uid { Faker::Number.number(10) }
    name { Faker::Name.name }
    email { Faker::Internet.email }
  end
end
