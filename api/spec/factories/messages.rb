FactoryBot.define do
  factory :message do
    content { 'テストメッセージ' }
    room
    user
    image { 'image.jpg' }
  end
end
