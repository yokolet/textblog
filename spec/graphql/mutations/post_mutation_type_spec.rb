require 'rails_helper'

describe Mutations::PostMutationType do

  it 'defines a field addPost that returns Types::PostType type' do
    expect(subject).to have_a_field(:addPost).that_returns(Types::PostType)
  end

  context 'with addPost field' do
    let(:facebook) { Faker::Omniauth.facebook }
    let(:access_token) { facebook[:credentials][:token] }
    let(:user) { create(:user) }
    let(:me) {
      {
          "id" => user.uid
      }
    }
    let(:social_api) { double("social_api") }
    let(:args) {
      {
        provider: 'facebook',
        title: Faker::Lorem.sentence,
        content: Faker::Lorem.paragraph
      }
    }
    let(:ctx) {
      {
        api: {
            access_token: access_token,
            social_api: social_api
        }
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
        expect(result["errors"].first[:status]).to eq(400)
      end
    end
  end
end
