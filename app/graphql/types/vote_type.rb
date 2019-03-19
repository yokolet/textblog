Types::VoteType = GraphQL::ObjectType.define do
  name "Vote"
  description "A Vote Type"

  field :id, !types.ID
  field :count, !types.Int
  field :user, !Types::UserType
  field :post, !Types::PostType
end
