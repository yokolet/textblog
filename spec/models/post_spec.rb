require 'rails_helper'

RSpec.describe Post, type: :model do
  it { should validate_presence_of(:title) }
  it { should validate_presence_of(:content) }
  it { should validate_length_of(:title).is_at_least(1).is_at_most(50) }
  it { should validate_length_of(:content).is_at_least(1).is_at_most(5000) }
  it { should belong_to(:user) }
end
