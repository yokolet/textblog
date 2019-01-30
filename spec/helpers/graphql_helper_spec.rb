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

  describe 'escape_angle_brackets' do
    let(:text) { "--<<O>>--" }
    let(:expected) { "--&lt;&lt;O&gt;&gt;--" }

    it 'escapes angle brackets' do
      expect(helper.escape_angle_brackets(text)).to eq(expected)
    end
  end
end
