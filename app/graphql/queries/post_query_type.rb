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
        raise GraphQL::ExecutionError.new("The page number is out of range", options: {type: "ParamError"})
      end
      result
    }
  end

  field :post do
    type Types::PostType
    description "returns a post of a specified id"
    argument :id, !types.ID
    resolve -> (obj, args, ctx) {
      begin
        Post.find(args[:id])
      rescue => e
        raise GraphQL::ExecutionError.new(e.message, options: {type: "ARError"})
      end
    }
  end
end
