Queries::VoteQueryType = GraphQL::ObjectType.define do
  name "VoteQueryType"
  description "The Vote Query Type"

  field :votes do
    type types[Types::VoteType]
    description "returns a comment list of a specified post"
    argument :post_id, !types.ID
    resolve -> (obj, args, ctx) {
      post = GraphqlHelper.ensure_post(args[:post_id])
      return post.votes
    }
  end
end
