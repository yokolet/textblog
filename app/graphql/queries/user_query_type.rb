Queries::UserQueryType = GraphQL::ObjectType.define do
  name "UserQueryType"
  description "The User Query Type"

  field :user do
    type Types::UserType
    description "returns a user"
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      User.find(args[:id])
    }
  end
end
