Types::QueryType = GraphQL::ObjectType.define do
  name "Query"
  description "Avaiable Queries"
  fields Util::FieldComposer.compose([
      Queries::UserQueryType,
      Queries::PostQueryType,
      Queries::PaginationQueryType])
end
