Mutations::UserMutationType = GraphQL::ObjectType.define do
  name "UserMutationType"
  description "The User Mutation Type"

  field :signInUser, Types::UserType do
    description "User sign in. User's access token should be set to the Authorization header."
    argument :provider, !types.String
    resolve -> (obj, args, ctx) {
      # this works only for facebook at this moment
      # later other social logins will be added
      social_api = GraphqlHelper.ensure_social_api(ctx)
      begin
        me = social_api.get_object('me', {'fields': 'id,name,email'}) # this line may raise error
      rescue => e
        # The error message is really lengthy, full explanation. Cut down to a clear message here.
        raise GraphQL::ExecutionError.new("Sign In again", options: {type: "OAuthError"})
      end
      User.where(provider: args[:provider], uid: me['id']).first_or_create do |user|
        user.name = me['name']
        user.email = me['email']
      end
    }
  end
end