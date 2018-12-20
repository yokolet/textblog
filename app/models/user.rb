class User < ApplicationRecord
  # validation
  validates_presence_of :name, :email
end
