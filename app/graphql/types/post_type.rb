Types::PostType = GraphQL::ObjectType.define do
  name "Post"

  field :id, !types.ID
  field :title, !types.String
  field :content, !types.String
  field :updated_at, !types.String
  field :user, !Types::UserType
end
