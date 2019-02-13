Queries::PostQueryType = GraphQL::ObjectType.define do
  name "PostQueryType"
  description "The Post Query Type"

  field :posts do
    type types[Types::PostType]
    description "returns a post list of a specified page"
    argument :page, !types.Int
    resolve -> (obj, args, ctx) {
      result = Post.left_outer_joins(:comments)
                   .select('posts.*, count(comments.*) as comments_count')
                   .group(:id)
                   .order(updated_at: :desc)
                   .page(args[:page])
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
      result = Post.left_outer_joins(:comments)
                   .where(id: args[:id])
                   .select("posts.*, count(comments.*) as comments_count")
                   .group(:id).first
      if result.nil?
        raise GraphQL::ExecutionError.new("The page number is out of range", options: {type: "ParamError"})
      end
      result
    }
  end
end
