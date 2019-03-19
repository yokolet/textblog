FactoryBot.define do
  factory :vote do
    count { 1 }
    user { nil }
    post { nil }
  end
end
