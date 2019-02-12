require 'rails_helper'

describe Mutations::PostMutationType do
  types = GraphQL::Define::TypeDefiner.instance

  it 'defines a field addPost that returns Types::PostType type' do
    expect(subject).to have_a_field(:addPost).that_returns(Types::PostType)
  end

  it 'defines a field deletePost that returns ID type' do
    expect(subject).to have_a_field(:deletePost).that_returns(types.ID)
  end

  it 'defines a field updatePost that returns ID type' do
    expect(subject).to have_a_field(:updatePost).that_returns(types.ID)
  end

  let(:facebook) { Faker::Omniauth.facebook }
  let(:access_token) { facebook[:credentials][:token] }
  let!(:user) {
    user = create(:user)
    user.posts.create(attributes_for(:post))
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

  context 'with addPost field' do
    let(:args) {
      {
          provider: 'facebook',
          title: Faker::Lorem.sentence,
          content: Faker::Lorem.paragraph
      }
    }

    it 'should create a post' do
      allow(social_api).to receive(:get_object).and_return(me)
      result = subject.fields['addPost'].resolve(nil, args, ctx)
      expect(result.id).not_to be_nil
    end

    describe 'given a wrong input' do
      let(:empty) {
        {
            provider: 'facebook',
            title: '',
            content: ''
        }
      }
      let(:too_long) {
        {
            provider: 'facebook',
            title: Faker::Lorem.characters(51),
            content: ''
        }
      }

      it('should raise error for empty input') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['addPost'].resolve(nil, empty, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end

      it('should raise error for too long input') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['addPost'].resolve(nil, too_long, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end
    end

    describe 'mutation is given' do
      let(:mutate_string) {
        %{mutation AddPost($provider: String!, $title: String!, $content: String!) {
            addPost(provider: $provider, title: $title, content: $content) {
              id
              title
              content
              updated_at
              user {
                id
                name
              }
            }
          }}
      }
      let(:vars) { { provider: "facebook", title: Faker::Lorem.characters(55), content: "" } }
      it('should return error in json with too long input') do
        allow(social_api).to receive(:get_object).and_return(me)
        result = TextblogSchema.execute(mutate_string, variables: vars, context: ctx)
        expect(result["data"]["addPost"]).to be_nil
        expect(result["errors"]).not_to be_nil
        expect(result["errors"].first[:type]).to eq("ParamError")
      end
    end
  end

  context 'with deletePost field' do
    let(:post_id) { user.posts.first.id }
    let(:args) {
      {
          provider: 'facebook',
          post_id: post_id
      }
    }

    it 'should delete a post' do
      allow(social_api).to receive(:get_object).and_return(me)
      result = subject.fields['deletePost'].resolve(nil, args, ctx)
      expect(result).to eq(post_id)
      expect(Post.all.length).to eq(1)
    end

    describe 'given a wrong input' do
      let(:args) {
        {
            provider: 'facebook',
            post_id: 0
        }
      }

      it('should raise error for wrong post id') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['deletePost'].resolve(nil, args, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end
    end

    describe 'mutation is given' do
      let(:post_id) { user.posts.last.id }
      let(:mutate_string) {
        %{mutation DeletePost($provider: String!, $post_id: ID!) {
            deletePost(provider: $provider, post_id: $post_id)
          }}
      }
      let(:vars) { { provider: "facebook", post_id: post_id } }

      it('should return id of deleted post') do
        allow(social_api).to receive(:get_object).and_return(me)
        result = TextblogSchema.execute(mutate_string, variables: vars, context: ctx)
        expect(result["data"]["deletePost"]).to eq(post_id.to_s) # since ID is string
      end
    end
  end

  context 'with updatePost field' do
    let(:post_id) { user.posts.last.id }
    let(:args) {
      {
          provider: 'facebook',
          post_id: post_id,
          title: Faker::Lorem.sentence,
          content: Faker::Lorem.paragraph
      }
    }

    it 'should update a post' do
      allow(social_api).to receive(:get_object).and_return(me)
      result = subject.fields['updatePost'].resolve(nil, args, ctx)
      expect(result).to eq(post_id)
      expect(Post.find(post_id).title).to eq(args[:title])
    end

    describe 'given a wrong input' do
      let(:args) {
        {
            provider: 'facebook',
            post_id: 0
        }
      }

      it('should raise error for wrong post id') do
        allow(social_api).to receive(:get_object).and_return(me)
        expect {subject.fields['updatePost'].resolve(nil, args, ctx)}.to raise_exception(GraphQL::ExecutionError)
      end
    end

    describe 'mutation is given' do
      let(:mutate_string) {
        %{mutation UpdatePost($provider: String!, $post_id: ID!, $title: String!, $content: String!) {
            updatePost(provider: $provider, post_id: $post_id, title: $title, content: $content)
          }}
      }
      let(:vars) {
        {
            provider: "facebook",
            post_id: post_id,
            title: Faker::Lorem.sentence,
            content: Faker::Lorem.paragraph
        }
      }

      it('should return id of updated post') do
        allow(social_api).to receive(:get_object).and_return(me)
        result = TextblogSchema.execute(mutate_string, variables: vars, context: ctx)
        expect(result["data"]["updatePost"]).to eq(post_id.to_s) # since ID is string
      end
    end
  end
end
