Types::UserType = GraphQL::ObjectType.define do
  name "User"
  description "A User Type"

  field :id, !types.ID
  field :provider, !types.String
  field :uid, !types.ID
  field :name, !types.String
  field :email, !types.String
  field :posts, types[Types::PostType]
end
