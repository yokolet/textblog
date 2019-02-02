Queries::PostQueryType = GraphQL::ObjectType.define do
  name "PostQueryType"
  description "The Post Query Type"

  field :allPosts do
    type types[Types::PostType]
    description "returns a list of all posts"
    resolve -> (obj, args, ctx) {
      Post.order(updated_at: :desc)
    }
  end
end
