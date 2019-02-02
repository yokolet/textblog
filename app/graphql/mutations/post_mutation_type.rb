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
        begin
          me = social_api.get_object('me', {'fields': 'id'})
        rescue
          # The error message is really lengthy, full explanation. Cut down to a clear message here.
          raise GraphQL::ExecutionError.new("Sign In again", options: {status: 400})
        end
        user = User.where(provider: args[:provider], uid: me['id']).first
        if user.nil?
          # After the user signed in, the account was deleted before submit. Not likely, but may happen.
          raise GraphQL::ExecutionError.new("Sign In again", options: {status: 400})
        end
        title = args[:title]
        if title.size < 1 || title.size > 50
          raise GraphQL::ExecutionError.new('title length should be between 1 and 50', options: {status: 400})
        end
        content = args[:content]
        if content.size < 1 || content.size > 5000
          raise GraphQL::ExecutionError.new('content length should be between 1 and 5000', options: {status: 400})
        end
        user.posts.create(title: GraphqlHelper.escape_angle_brackets(title),
                          content: GraphqlHelper.escape_angle_brackets(content))
      rescue => e
        if (e.is_a?(GraphQL::ExecutionError))
          raise e
        else
          raise GraphQL::ExecutionError.new(e.message, options: {status: 500})
        end
      end
    }
  end
end
