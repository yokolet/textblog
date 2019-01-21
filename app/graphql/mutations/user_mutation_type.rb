Mutations::UserMutationType = GraphQL::ObjectType.define do
  name "UserMutationType"
  description "The User Mutation Type"

  field :signInUser, Types::UserType do
    description "User sign in. User's access token should be set to the Authorization header."
    argument :provider, !types.String
    resolve -> (obj, args, ctx) {
      access_token, social_api = ctx[:api][:access_token], ctx[:api][:social_api]
      if access_token.nil?
        raise GraphQL::ExecutionError.new('Authorization request header is missing.')
      end
      if social_api.nil?
        raise GraphQL::ExecutionError.new('Authorization request header is invalid.')
      end
      begin
        # this works only for facebook at this moment
        # later other social logins will be added
        me = social_api.get_object('me', {'fields': 'id,name,email'}) # this line may raise error
        User.where(provider: args[:provider], uid: me['id']).first_or_create do |user|
          user.name = me['name']
          user.email = me['email']
        end
      rescue => e
        GraphQL::ExecutionError.new(e.message)
      end
    }
  end
end