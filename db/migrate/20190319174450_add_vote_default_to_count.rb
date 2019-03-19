class AddVoteDefaultToCount < ActiveRecord::Migration[5.2]
  def change
    change_column_default :votes, :count, 0
  end
end
