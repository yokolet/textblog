Queries::UserQueryType = GraphQL::ObjectType.define do
  name "UserQueryType"
  description "The User Query Type"

  field :user do
    type Types::UserType
    description "returns a user"
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      begin
        User.find(args[:id])
      rescue => e
        raise GraphQL::ExecutionError.new(e.message, options: {type: "ARError"})
      end
    }
  end
end
