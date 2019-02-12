Queries::CommentQueryType = GraphQL::ObjectType.define do
  name "CommentQueryType"
  description "The Comment Query Type"

  field :comments do
    type types[Types::CommentType]
    description "returns a comment list of a specified post"
    argument :post_id, !types.ID
    resolve -> (obj, args, ctx) {
      begin
        post = Post.find(args[:post_id])
      rescue => e
        raise GraphQL::ExecutionError.new(e.message, options: {type: "ARError"})
      end
      return post.comments.order(updated_at: :desc)
    }
  end
end
