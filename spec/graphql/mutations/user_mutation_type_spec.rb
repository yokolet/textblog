require 'rails_helper'

describe Mutations::UserMutationType do

  it 'defines a field signInUser that returns Types::UserType type' do
    expect(subject).to have_a_field(:signInUser).that_returns(Types::UserType)
  end

  context 'with signInUser field' do
    let(:facebook) { Faker::Omniauth.facebook }
    let(:access_token) { facebook[:credentials][:token] }
    let(:me) {
      {
          "id" => facebook[:uid],
          "name" => facebook[:info][:name],
          "email" => facebook[:info][:email]
      }
    }
    let(:social_api) { double("social_api") }
    let(:args) { { provider: 'facebook' } }
    let(:ctx) { {
        api: {
            provider: 'facebook',
            social_api: social_api
        }
    } }

    it 'create or find a user' do
      allow(social_api).to receive(:get_object).and_return(me)
      result = subject.fields['signInUser'].resolve(nil, args, ctx)
      expect(result.id).not_to be_nil
    end

    describe 'a mutation is given' do
      let(:vars) { { provider: "facebook" } }
      let(:result) { TextblogSchema.execute(mutate_string, variables: vars, context: ctx) }

      context 'to sign in user' do
        let(:mutate_string) { %|mutation SignInUser($provider: String!) { signInUser(provider: $provider) { id name } }| }

        it 'returns a user info' do
          allow(social_api).to receive(:get_object).and_return(me)
          result_user = result["data"]["signInUser"]
          expect(result_user["id"]).not_to be_nil
          expect(result_user["name"]).to eq(me["name"])
        end
      end
    end
  end
end