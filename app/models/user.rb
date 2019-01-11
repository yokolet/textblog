class User < ApplicationRecord
  # Include devise modules.
  devise :omniauthable, omniauth_providers: [:facebook]
  # validation
  validates_presence_of :name, :email

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name
    end
  end
end
