Types::UserType = GraphQL::ObjectType.define do
  name "User"

  field :id, !types.ID
  field :provider, !types.String
  field :uid, !types.ID
  field :name, !types.String
  field :email, !types.String
end
