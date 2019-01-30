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
  end
end