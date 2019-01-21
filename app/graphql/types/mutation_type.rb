Types::MutationType = GraphQL::ObjectType.define do
  name "Mutation"
  description "Available Mutations"

  fields Util::FieldComposer.compose([Mutations::UserMutationType])
end