require 'rails_helper'

RSpec.describe User, type: :model do
  it { should validate_presence_of(:provider) }
  it { should validate_presence_of(:uid) }
  it { should validate_presence_of(:name) }
  it { should validate_presence_of(:email) }
  it { should have_many(:posts) }
end
