Queries::PaginationQueryType = GraphQL::ObjectType.define do
  name "PaginationQueryType"
  description "The Pagination Query Type"

  field :pages do
    type Types::PaginationType
    description "returns a first and last page numbers"
    resolve -> (obj, args, ctx) {
      per = Post.page(1).limit_value # Post model defines `paginates_per 5`
      last = Post.page(1).total_pages
      return Pages.new(per, last)
    }
  end
end

class Pages
  def initialize(per, last)
    @per = per
    @last = last
  end

  def per
    return @per
  end

  def last
    return @last
  end
end