require 'rails_helper'

RSpec.describe 'Api::V1::Posts', type: :request do
  # let:遅延評価 let!:事前評価
  let(:password) { 'password' }
  let(:user) { create(:user, password:) }

  describe '#create' do
    before do
      @auth_headers = login(user.email, 'password')
    end

    context 'normal' do
      it 'response at create is created' do
        # attributes_for:モデルオブジェクトではなくハッシュを返す
        post(api_v1_posts_path, params: { post: attributes_for(:post) }, headers: @auth_headers)
        expect(response).to have_http_status :created
      end

      it 'same params and json response in place' do
        post(api_v1_posts_path, params: { post: attributes_for(:post, place: '日本、〒103-0027 東京都中央区日本橋') }, headers: @auth_headers)
        expect(JSON.parse(response.body)['place']).to eq('日本、〒103-0027 東京都中央区日本橋')
      end

      it 'post records increases' do
        expect do
          post(api_v1_posts_path, params: { post: attributes_for(:post) }, headers: @auth_headers)
        end.to change(Post, :count).by 1
      end
    end

    context 'abnormal' do
      it 'response when create fails is bad_request' do
        post(api_v1_posts_path, params: { post: attributes_for(:post, place: nil) }, headers: @auth_headers)
        expect(response).to have_http_status(:bad_request)
      end

      it 'error is returned when place is nil' do
        post(api_v1_posts_path, params: { post: attributes_for(:post, place: nil) }, headers: @auth_headers)
        expect(JSON.parse(response.body)['place']).to eq ["can't be blank"]
      end

      it 'records will not increase if place is nil' do
        expect do
          post(api_v1_posts_path, params: { post: attributes_for(:post, place: nil) }, headers: @auth_headers)
        end.not_to change(Post, :count)
      end
    end
  end
end