Queries::PostQueryType = GraphQL::ObjectType.define do
  name "PostQueryType"
  description "The Post Query Type"

  field :posts do
    type types[Types::PostType]
    description "returns a post list of a specified page"
    argument :page, !types.Int
    resolve -> (obj, args, ctx) {
      result = Post.order(updated_at: :desc).page(args[:page])
      if result.empty?
        raise GraphQL::ExecutionError.new("The page number is out of range", options: {status: 400})
      end
      result
    }
  end
end
