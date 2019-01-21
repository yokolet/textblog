Queries::UserQueryType = GraphQL::ObjectType.define do
  name "UserQueryType"
  description "The User Query Type"

  field :allUsers do
    type types[Types::UserType]
    description "returns a list of all users"
    resolve -> (obj, args, ctx) {
      User.all
    }
  end

  field :user do
    type Types::UserType
    description "returns a user"
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      User.find(args[:id])
    }
  end
end
