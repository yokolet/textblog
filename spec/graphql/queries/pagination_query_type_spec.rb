require 'rails_helper'

describe Queries::PaginationQueryType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field pages that returns an array of Types::PaginationType type' do
    expect(subject).to have_a_field(:pages).that_returns(Types::PaginationType)
  end

  context 'with posts' do
    let!(:users) {
      users = create_list(:user, 3)
      users.each do |user|
        user.posts.create(attributes_for(:post))
        user.posts.create(attributes_for(:post))
      end
      users
    } # creates 3 * 2 posts

    it 'returns per 5 and last 2' do
      result = subject.fields['pages'].resolve(nil, nil, nil)
      expect(result.per).to eq(5)
      expect(result.last).to eq(2)
    end

    describe 'a query is given' do
      let(:vars) { {} }
      let(:ctx) { {} }
      let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }

      context 'to request all post titles' do
        let(:query_string) { %|query { pages { per last } }| }

        it 'returns per 5 and last 2' do
          expect(result["data"]["pages"]["per"]).to eq(5)
          expect(result["data"]["pages"]["last"]).to eq(2)
        end
      end
    end
  end
end