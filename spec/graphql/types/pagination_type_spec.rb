require 'rails_helper'

describe Types::PaginationType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field per of type Int!' do
    expect(subject).to have_field(:per).that_returns(!types.Int)
  end

  it 'defines a field last of type Int!' do
    expect(subject).to have_field(:last).that_returns(!types.Int)
  end
end
