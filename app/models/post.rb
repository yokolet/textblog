class Post < ApplicationRecord
  validates_presence_of :title, :content
  validates_length_of :title, minimum: 1, maximum: 50
  validates_length_of :content, minimum: 1, maximum: 5000
  belongs_to :user
end
