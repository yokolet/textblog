require 'rails_helper'

RSpec.describe Comment, type: :model do
  it { should validate_presence_of(:body) }
  it { should validate_length_of(:body).is_at_least(1) }
  it { should belong_to(:user) }
  it { should belong_to(:post) }
end
