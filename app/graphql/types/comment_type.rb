Types::CommentType = GraphQL::ObjectType.define do
  name "Comment"
  description "A Comment Type"

  field :id, !types.ID
  field :body, !types.String
  field :updated_at, !types.String
  field :user, !Types::UserType
  field :post, !Types::PostType
end
