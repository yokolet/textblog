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
        user = GraphqlHelper.ensure_user(ctx)
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

  field :deletePost, types.ID do
    description "Delete a post."
    argument :provider, !types.String
    argument :post_id, !types.ID
    resolve -> (obj, args, ctx) {
      begin
        user = GraphqlHelper.ensure_user(ctx)
        post = Post.find(args[:post_id])
        if user.id == post.user.id
          deleted = post.delete
        else
          raise GraphQL::ExecutionError.new('This is not your post.', options: {status: 400})
        end
        deleted.id
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
