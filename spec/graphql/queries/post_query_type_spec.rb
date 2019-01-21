require 'rails_helper'

describe Queries::PostQueryType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field allPosts that returns an array of Types::PostType type' do
    expect(subject).to have_a_field(:allPosts).that_returns(types[Types::PostType])
  end

  context 'with posts' do
    let!(:users) { create_list(:user, 3) } # creates 3 * 2 posts

    it 'returns all posts' do
      result = subject.fields['allPosts'].resolve(nil, nil, nil)
      expect(result.size).to eq(6)
      expect(result.first.user.id).to eq(users.first.id)
    end

    describe 'a query is given' do
      let(:vars) { {} }
      let(:ctx) { {} }
      let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }

      context 'to request all post titles' do
        let(:query_string) { %|query { allPosts { title } }| }

        it 'returns titles' do
          test_titles = users.map(&:posts).reduce([]) { |acc, x| acc + x.map(&:title) }
          result_titles = result["data"]["allPosts"].map { |x| x["title"] }
          expect(result_titles).to match_array(test_titles)
          result_ids = result["data"]["allPosts"].map { |x| x["id"] }
          expect(result_ids).to match_array([nil]*6)
        end
      end
    end
  end
end