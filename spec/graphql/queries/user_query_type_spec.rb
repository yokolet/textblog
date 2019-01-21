require 'rails_helper'

describe Queries::UserQueryType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field allUsers that returns an array of Types::UserType type' do
    expect(subject).to have_a_field(:allUsers).that_returns(types[Types::UserType])
  end

  it 'defines a field user that returns Types::UserType type' do
    expect(subject).to have_a_field(:user).that_returns(Types::UserType)
  end

  context 'with users' do
    let!(:users) { create_list(:user, 3) }
    let!(:a_user) { users.last }

    it 'returns all users' do
      result = subject.fields['allUsers'].resolve(nil, nil, nil)
      expect(result.size).to eq(3)
      expect(result.first.posts.size).to eq(2)
    end

    it 'returns a user of id' do
      result = subject.fields['user'].resolve(nil, {id: a_user.id}, nil)
      expect(result.name).to eq(a_user.name)
      expect(result.posts.first.title).to eq(a_user.posts.first.title)
    end

    describe 'a query is given' do
      let(:vars) { {} }
      let(:ctx) { {} }
      let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }

      context 'to request all user names' do
        let(:query_string) { %|query { allUsers { name } }| }

        it 'returns names' do
          result_names = result["data"]["allUsers"].map { |x| x["name"] }
          expect(result_names).to match_array(users.map(&:name))
          result_ids = result["data"]["allUsers"].map { |x| x["id"] }
          expect(result_ids).to match_array([nil]*3)
        end
      end

      context 'to request a single user' do
        let(:vars) { {"id": a_user.id} }
        let(:query_string) {
          %|query user($id: ID!) {
              user(id: $id) {
                name
                posts {
                  title
                }
              }
            }|
        }
        it 'returns a name and uid' do
          result_user = result["data"]["user"]
          expect(result_user["name"]).to eq(a_user.name)
          expect(result_user["id"]).to be_nil
          expect(result_user["posts"].first["title"]).to eq(a_user.posts.first.title)
        end
      end
    end
  end
end