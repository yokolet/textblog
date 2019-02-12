require 'rails_helper'

describe Queries::CommentQueryType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field posts that returns an array of Types::PostType type' do
    expect(subject).to have_a_field(:comments).that_returns(types[Types::CommentType])
  end

  context 'for comments query' do
    let!(:user) {
      user = create(:user)
      user.posts.create(attributes_for(:post))
      user.posts.create(attributes_for(:post))
      user.posts.each do |post|
        attr = {user: user, post: post}
        attr = attr.merge(attributes_for(:comment))
        post.comments.create(attr)
        attr = attr.merge(attributes_for(:comment))
        post.comments.create(attr)
      end
      user
    } # creates 2 posts, 2 comments each -> 4 comments in total
    let(:post) { user.posts.last }

    it 'returns comments for a post' do
      result = subject.fields['comments'].resolve(nil, {post_id: post.id}, nil)
      expect(result.size).to eq(2)
      expect(result.first.user.id).to eq(user.id)
    end

    it 'raises an error for a wrong post is' do
      expect { subject.fields['comments'].resolve(nil, {post_id: 100}, nil) }.to raise_error(GraphQL::ExecutionError)
    end

    describe 'a query is given' do
      let(:vars) { {post_id: post.id} }
      let(:ctx) { {} }
      let(:result) { TextblogSchema.execute(query_string, variables: vars, context: ctx) }

      context 'to request all post titles' do
        let(:query_string) { %|query Comment($post_id: ID!) { comments(post_id: $post_id) { body user { id } } }| }

        it 'returns body and user id' do
          test_bodies = post.comments.map(&:body)
          result_bodies = result["data"]["comments"].map { |x| x["body"] }
          expect(result_bodies).to match_array(test_bodies)
          result_id = result["data"]["comments"][0]["user"]["id"]
          expect(result_id).to eq(user.id.to_s)
        end
      end
    end
  end
end