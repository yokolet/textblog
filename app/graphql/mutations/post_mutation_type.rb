Mutations::PostMutationType = GraphQL::ObjectType.define do
  name "PostMutationType"
  description "The Post Mutation Type"

  field :addPost, Types::PostType do
    description "Add a new post."
    argument :provider, !types.String
    argument :title, !types.String
    argument :content, !types.String
    resolve -> (obj, args, ctx) {
      user = GraphqlHelper.ensure_user(ctx)
      title = args[:title]
      if title.size < 1 || title.size > 50
        raise GraphQL::ExecutionError.new('title length should be between 1 and 50', options: {type: "ParamError"})
      end
      content = args[:content]
      if content.size < 1 || content.size > 5000
        raise GraphQL::ExecutionError.new('content length should be between 1 and 5000', options: {type: "ParamError"})
      end
      user.posts.create(title: GraphqlHelper.escape_angle_brackets(title),
                        content: GraphqlHelper.escape_angle_brackets(content))
    }
  end

  field :deletePost, types.ID do
    description "Delete a post."
    argument :provider, !types.String
    argument :post_id, !types.ID
    resolve -> (obj, args, ctx) {
      user = GraphqlHelper.ensure_user(ctx)
      begin
        post = Post.find(args[:post_id])
      rescue => e
        raise GraphQL::ExecutionError.new(e.message, options: {type: "ARError"})
      end
      if user.id == post.user.id
        deleted = post.delete
      else
        raise GraphQL::ExecutionError.new('This is not your post.', options: {type: "ParamError"})
      end
      deleted.id
    }
  end
end
