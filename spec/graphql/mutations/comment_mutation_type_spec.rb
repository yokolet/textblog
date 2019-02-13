require 'rails_helper'

describe Mutations::CommentMutationType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field addComment that returns Types::CommentType type' do
    expect(subject).to have_a_field(:addComment).that_returns(Types::CommentType)
  end

  it 'defines a field deleteComment that returns ID type' do
    expect(subject).to have_a_field(:deleteComment).that_returns(types.ID)
  end

  let(:facebook) { Faker::Omniauth.facebook }
  let(:access_token) { facebook[:credentials][:token] }
  let!(:user) {
    user = create(:user)
    user.posts.create(attributes_for(:post))
    user
  }
  let(:me) {
    {
        "id" => user.uid
    }
  }
  let(:social_api) { double("social_api") }
  let(:ctx) {
    {
        api: {
            provider: 'facebook',
            social_api: social_api
        }
    }
  }

  context 'with addComment field' do
    let(:args) {
      {
          provider: 'facebook',
          post_id: user.posts.first.id,
          body: Faker::Lorem.sentence
      }
    }

    it 'should create a comment' do
      allow(social_api).to receive(:get_object).and_return(me)
      result = subject.fields['addComment'].resolve(nil, args, ctx)
      expect(result.id).not_to be_nil
    end

    describe 'given a wrong input' do
      let(:wrong_id) {
        {
            provider: 'facebook',
            post_id: 100,
            body: ''
        }
      }
      let(:too_long) {
        {
            provider: 'facebook',
            post_id: user.posts.first.id,
            body: Faker::Lorem.characters(300)
        }
      }

      it('should raise error for wrong post id') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['addComment'].resolve(nil, wrong_id, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end

      it('should raise error for too long input') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['addComment'].resolve(nil, too_long, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end
    end

    describe 'mutation is given' do
      let(:mutate_string) {
        %{mutation AddComment(
            $provider: String!,
            $post_id: ID!,
            $body: String!) {
            addComment(
              provider: $provider,
              post_id: $post_id,
              body: $body) {
                id
                body
                updated_at
                user {
                  id
                  name
                }
            }
          }}
      }
      let(:vars) { { provider: "facebook", post_id: user.posts.first.id.to_s, body: Faker::Lorem.sentence } }
      it('should create a comment') do
        allow(social_api).to receive(:get_object).and_return(me)
        result = TextblogSchema.execute(mutate_string, variables: vars, context: ctx)
        expect(result["data"]["addComment"]["body"]).to eq(vars[:body])
        expect(result["data"]["addComment"]["user"]["id"]).to eq(user.id.to_s)
      end

      let(:wrong_vars) { { provider: "facebook", post_id: user.posts.first.id.to_s, body: "" } }
      it('should return error in json with empty input') do
        allow(social_api).to receive(:get_object).and_return(me)
        result = TextblogSchema.execute(mutate_string, variables: wrong_vars, context: ctx)
        expect(result["data"]["addComment"]).to be_nil
        expect(result["errors"]).not_to be_nil
        expect(result["errors"].first[:type]).to eq("ParamError")
      end
    end
  end

  context 'with deleteComment field' do
    let(:users) {
      create_list(:user, 2).each do |user|
        post = user.posts.create(attributes_for(:post))
        post.comments.create(user: user, body: Faker::Lorem.sentence)
      end
      # two users, one post each, each post has one comment
    }
    let(:own_comment_id) { users.first.posts.first.comments.first.id }
    let(:some_comment_id) { users.last.posts.first.comments.first.id }
    let(:args) {
      {
          provider: 'facebook',
          comment_id: own_comment_id.to_s
      }
    }
    let(:me) {
      {
          "id" => users.first.uid
      }
    }

    it 'should delete a comment' do
      allow(social_api).to receive(:get_object).and_return(me)
      result = subject.fields['deleteComment'].resolve(nil, args, ctx)
      expect(result).to eq(own_comment_id)
    end

    describe 'given a wrong input' do
      let(:args) {
        {
            provider: 'facebook',
            comment_id: some_comment_id
        }
      }

      it('should raise error for wrong comment id') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['deleteComment'].resolve(nil, args, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end
    end

    describe 'mutation is given' do
      let(:me) {
        {
            "id" => users.last.uid
        }
      }
      let(:mutate_string) {
        %{mutation DeleteComment($provider: String!, $comment_id: ID!) {
            deleteComment(provider: $provider, comment_id: $comment_id)
          }}
      }
      let(:vars) { { provider: "facebook", comment_id: some_comment_id.to_s } }

      it('should return id of deleted comment') do
        allow(social_api).to receive(:get_object).and_return(me)
        result = TextblogSchema.execute(mutate_string, variables: vars, context: ctx)
        expect(result["data"]["deleteComment"]).to eq(some_comment_id.to_s) # since ID is string
      end
    end
  end
end
