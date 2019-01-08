class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:facebook]
  # validation
  validates_presence_of :name, :email

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name
      user.token = auth.credentials.token
      user.token_expires_at = auth.credentials.expires_at
      user.password = Devise.friendly_token[0,20]
    end
  end
end
