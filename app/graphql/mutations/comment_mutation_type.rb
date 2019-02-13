Mutations::CommentMutationType = GraphQL::ObjectType.define do
  name "CommentMutationType"
  description "The Comment Mutation Type"

  field :addComment, Types::CommentType do
    description "Add a new comment."
    argument :provider, !types.String
    argument :post_id, !types.ID
    argument :body, !types.String
    resolve -> (obj, args, ctx) {
      user = GraphqlHelper.ensure_user(ctx)
      post = GraphqlHelper.ensure_post(args[:post_id])
      body = GraphqlHelper.escape_angle_brackets(args[:body])
      if body.size < 1 || body.size > 255
        raise GraphQL::ExecutionError.new('body length should not be between 1 and 255', options: {type: "ParamError"})
      end
      post.comments.create(body: body, user: user)
    }
  end

  field :deleteComment, types.ID do
    description "Delete a comment."
    argument :provider, !types.String
    argument :comment_id, !types.ID
    resolve -> (obj, args, ctx) {
      user = GraphqlHelper.ensure_user(ctx)
      begin
        comment = Comment.find(args[:comment_id])
      rescue => e
        raise GraphQL::ExecutionError.new(e.message, options: {type: "ARError"})
      end
      if user.id == comment.user.id
        deleted = comment.delete
      else
        raise GraphQL::ExecutionError.new('This is not your post.', options: {type: "ParamError"})
      end
      deleted.id
    }
  end
end
