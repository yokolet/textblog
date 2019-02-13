Queries::CommentQueryType = GraphQL::ObjectType.define do
  name "CommentQueryType"
  description "The Comment Query Type"

  field :comments do
    type types[Types::CommentType]
    description "returns a comment list of a specified post"
    argument :post_id, !types.ID
    resolve -> (obj, args, ctx) {
      post = GraphqlHelper.ensure_post(args[:post_id])
      return post.comments
    }
  end
end
