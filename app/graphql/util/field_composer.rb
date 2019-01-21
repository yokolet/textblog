module Util
  class FieldComposer
    def self.compose(types)
      ret = types.reduce({}) do |acc, type|
        acc.merge(type.fields)
      end
      ret
    end
  end
end