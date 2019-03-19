require 'rails_helper'

describe Types::VoteType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field id of type ID!' do
    expect(subject).to have_field(:id).that_returns(!types.ID)
  end

  it 'defines a field count of type Integer!' do
    expect(subject).to have_field(:count).that_returns(!types.Int)
  end

  it 'defines a field user of type Types::UserType!' do
    expect(subject).to have_field(:user).that_returns(!Types::UserType)
  end

  it 'defines a field post of type Types::PostType!' do
    expect(subject).to have_field(:post).that_returns(!Types::PostType)
  end
end
