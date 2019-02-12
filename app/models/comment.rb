class Comment < ApplicationRecord
  validates_presence_of :body, minimum: 1
  belongs_to :user
  belongs_to :post
end
