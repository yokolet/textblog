require 'rails_helper'

describe Types::CommentType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field id of type ID!' do
    expect(subject).to have_field(:id).that_returns(!types.ID)
  end

  it 'defines a field provider of type String!' do
    expect(subject).to have_field(:body).that_returns(!types.String)
  end

  it 'defines a field updated_at of type String!' do
    expect(subject).to have_field(:updated_at).that_returns(!types.String)
  end

  it 'defines a field user of type Types::UserType!' do
    expect(subject).to have_field(:user).that_returns(!Types::UserType)
  end
end
