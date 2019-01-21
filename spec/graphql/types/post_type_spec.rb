require 'rails_helper'

describe Types::PostType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field id of type ID!' do
    expect(subject).to have_field(:id).that_returns(!types.ID)
  end

  it 'defines a field title of type String!' do
    expect(subject).to have_field(:title).that_returns(!types.String)
  end

  it 'defines a field content of type String!' do
    expect(subject).to have_field(:content).that_returns(!types.String)
  end

  it 'defines a field updated_at of type String!' do
    expect(subject).to have_field(:updated_at).that_returns(!types.String)
  end

  it 'defines a field user of type Types::UserType!' do
    expect(subject).to have_field(:user).that_returns(!Types::UserType)
  end
end
