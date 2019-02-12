require 'rails_helper'

describe Queries::PostQueryType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field posts that returns an array of Types::PostType type' do
    expect(subject).to have_a_field(:posts).that_returns(types[Types::PostType])
  end

  it 'defines a field post that returns Types::PostType type' do
    expect(subject).to have_a_field(:post).that_returns(Types::PostType)
  end

  context 'for posts query' do
    let!(:users) {
      users = create_list(:user, 3)
      users.each do |user|
        user.posts.create(attributes_for(:post))
        user.posts.create(attributes_for(:post))
      end
      users
    } # creates 3 * 2 posts

    it 'returns posts for a page' do
      result = subject.fields['posts'].resolve(nil, {page: 1}, nil)
      expect(result.size).to eq(5)
      expect(result.first.user.id).to eq(users.last.id)
    end

    it 'raises an error for an out of range page number' do
      expect { subject.fields['posts'].resolve(nil, {page: 10}, nil) }.to raise_error(GraphQL::ExecutionError)
    end

    describe 'a query is given' do
      let(:vars) { {page: 1} }
      let(:ctx) { {} }
      let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }

      context 'to request all post titles' do
        let(:query_string) { %|query Post($page: Int!) { posts(page: $page) { title } }| }

        it 'returns titles' do
          test_titles = users.map(&:posts).reduce([]) { |acc, x| acc + x.map(&:title) }
          test_titles = test_titles.slice(test_titles.size-5, test_titles.size) # per page is 5
          result_titles = result["data"]["posts"].map { |x| x["title"] }
          expect(result_titles).to match_array(test_titles)
          result_ids = result["data"]["posts"].map { |x| x["id"] }
          expect(result_ids).to match_array([nil]*5)
        end
      end
    end
  end

  context 'for post query' do
    let!(:user) {
      user = create(:user)
      user.posts.create(attributes_for(:post))
      user.posts.create(attributes_for(:post))
      user
    } # creates 2 posts
    let(:post) { user.posts[0] }

    it 'returns a post of given id' do
      result = subject.fields['post'].resolve(nil, {id: post.id}, nil)
      expect(result.id).to eq(post.id)
      expect(result.user.id).to eq(user.id)
    end

    it 'raises and error for a wrong post id' do
      expect { subject.fields['post'].resolve(nil, {id: 100}, nil) }.to raise_error(GraphQL::ExecutionError)
    end

    describe 'a query is given' do
      let(:vars) { {id: post.id} }
      let(:ctx) { {} }
      let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }

      context 'to request all post titles' do
        let(:query_string) { %|query Post($id: ID!) { post(id: $id) { title user { name } } }| }

        it 'returns title and user name' do
          expect(result["data"]["post"]["title"]).to eq(post.title)
          expect(result["data"]["post"]["user"]["name"]).to eq(user.name)
        end
      end
    end
  end
end