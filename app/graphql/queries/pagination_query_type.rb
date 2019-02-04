Queries::PaginationQueryType = GraphQL::ObjectType.define do
  name "PaginationQueryType"
  description "The Pagination Query Type"

  field :pages do
    type Types::PaginationType
    description "returns a first and last page numbers"
    resolve -> (obj, args, ctx) {
      # Post model defines `paginates_per 5`
      per = Post.page(1).limit_value
      last = Post.page(1).total_pages
      Pages = Struct.new(:per, :last)
      return Pages.new(per, last)
    }
  end
end
