FactoryBot.define do
  factory :reaction do
    to_user_id { nil }
    from_user_id { nil }
    matched { false }
  end
end
