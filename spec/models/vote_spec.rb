require 'rails_helper'

RSpec.describe Vote, type: :model do
  it { should validate_presence_of(:count) }
  it { should belong_to(:user) }
  it { should belong_to(:post) }
end
