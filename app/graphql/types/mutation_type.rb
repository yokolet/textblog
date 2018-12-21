Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :createUser, Types::UserType do
    argument :name, !types.String
    argument :email, !types.String
    resolve -> (obj, args, ctx) {
      User.create(name: args[:name], email: args[:email])
    }
  end

  field :updateUser, Types::UserType do
    argument :id, !types.ID
    argument :name, types.String
    argument :email, types.String
    resolve -> (obj, args, ctx) {
      user = User.find(args[:id])
      user.update!(args.to_h)
      user
    }
  end

  field :destroyUser, Types::UserType do
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      User.find(args[:id]).destroy!
      nil
    }
  end
end