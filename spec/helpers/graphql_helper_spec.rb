require 'rails_helper'

# Specs in this file have access to a helper object that includes
# the GraphqlHelper. For example:
#
# describe GraphqlHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end
RSpec.describe GraphqlHelper, type: :helper do
  describe 'get_api' do
    let(:auth) { { "authorization" => 'Bearer 1a2b3c4d5e6f7g8h9i0j'} }
    let(:vars) { { provider: 'facebook' } }
    let(:req) { double("request") }

    context 'with an expected headers and variables' do
      it 'returns social api' do
        allow(req).to receive(:headers).and_return(auth)
        expect(helper.get_api(req, vars)[:social_api].respond_to?(:get_object)).to be_truthy
      end
    end

    context 'without an expected headers or variables' do
      it 'does not return social api' do
        allow(req).to receive(:headers).and_return({})
        expect(helper.get_api(req, vars)[:social_api]).to be_nil
      end

      it 'does not return social api' do
        allow(req).to receive(:headers).and_return(auth)
        expect(helper.get_api(req, { provider: 'twitter' })[:social_api]).to be_nil
      end
    end
  end

  context 'ensure_social_api' do
    describe 'with nil in all params' do
      let(:ctx) {
        {
            api: {
                access_token: nil,
                social_api: nil
            }
        }
      }

      it 'should raise an error' do
        expect { subject.ensure_social_api(ctx) }.to raise_error(StandardError)
      end
    end

    describe 'with correct values in all params' do
      let(:social_api) { double("social_api") }
      let(:ctx) {
        {
            api: {
                access_token: "1a2b3c4d5e6f7g8h9i0j",
                social_api: social_api
            }
        }
      }

      it 'should return social api' do
        expect(subject.ensure_social_api(ctx)).to eq(social_api)
      end
    end
  end

  context 'escape_angle_brackets' do
    let(:text) { "--<<O>>--" }
    let(:expected) { "--&lt;&lt;O&gt;&gt;--" }

    it 'escapes angle brackets' do
      expect(subject.escape_angle_brackets(text)).to eq(expected)
    end
  end
end
