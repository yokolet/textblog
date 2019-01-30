require 'rails_helper'

describe Types::UserType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field id of type ID!' do
    expect(subject).to have_field(:id).that_returns(!types.ID)
  end

  it 'defines a field provider of type String!' do
    expect(subject).to have_field(:provider).that_returns(!types.String)
  end

  it 'defines a field name of type String!' do
    expect(subject).to have_field(:name).that_returns(!types.String)
  end

  it 'defines a field posts of type [Types::PostType]' do
    expect(subject).to have_field(:posts).that_returns(types[Types::PostType])
  end

  it 'does not define a field email' do
    expect(subject).not_to have_field(:email)
  end
end
