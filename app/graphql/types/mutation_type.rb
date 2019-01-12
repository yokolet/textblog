Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"

  field :signInUser, Types::UserType do
    resolve -> (obj, args, ctx) {
      access_token, koala = ctx[:api][:access_token], ctx[:api][:koala]
      if access_token.nil?
        raise GraphQL::ExecutionError.new('Authorization request header is missing.')
      end
      if koala.nil?
        raise GraphQL::ExecutionError.new('Authorization request header is invalid.')
      end
      begin
        me = koala.get_object('me', {'fields': 'id,name,email'}) # this line may raise error
        User.where(provider: 'facebook', uid: me['id']).first_or_create do |user|
          user.name = me['name']
          user.email = me['email']
        end
      rescue => e
        GraphQL::ExecutionError.new(e.message)
      end
    }
  end

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