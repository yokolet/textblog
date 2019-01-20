require 'rails_helper'

RSpec.describe Types::UserType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field id of type ID!' do
    expect(subject).to have_field(:id).that_returns(!types.ID)
  end

  it 'defines a field provider of type String!' do
    expect(subject).to have_field(:provider).that_returns(!types.String)
  end

  it 'defines a field uid of type ID!' do
    expect(subject).to have_field(:uid).that_returns(!types.ID)
  end

  it 'defines a field name of type String!' do
    expect(subject).to have_field(:name).that_returns(!types.String)
  end

  it 'defines a field email of type String!' do
    expect(subject).to have_field(:email).that_returns(!types.String)
  end

  it 'defines a field posts of type [Types::PostType]' do
    expect(subject).to have_field(:posts).that_returns(types[Types::PostType])
  end
end
