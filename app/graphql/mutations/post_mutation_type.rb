Mutations::PostMutationType = GraphQL::ObjectType.define do
  name "PostMutationType"
  description "The Post Mutation Type"

  field :addPost, Types::PostType do
    description "Add a new post."
    argument :provider, !types.String
    argument :title, !types.String
    argument :content, !types.String
    resolve -> (obj, args, ctx) {
      begin
        social_api = GraphqlHelper.ensure_social_api(ctx)
        me = social_api.get_object('me', {'fields': 'id'}) # this line may raise error
        user = User.where(provider: args[:provider], uid: me['id']).first
        if user.nil?
          raise StandardError.new("can't find a user")
        end
        user.posts.create(title: GraphqlHelper.escape_angle_brackets(args[:title]),
                          content: GraphqlHelper.escape_angle_brackets(args[:content]))
      rescue => e
        GraphQL::ExecutionError.new(e.message)
      end
    }
  end
end
