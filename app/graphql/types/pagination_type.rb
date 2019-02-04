Types::PaginationType = GraphQL::ObjectType.define do
  name "Pagination"
  description "A Pagination Type"

  field :per, !types.Int
  field :last, !types.Int
end
