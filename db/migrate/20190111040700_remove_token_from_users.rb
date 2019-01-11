class RemoveTokenFromUsers < ActiveRecord::Migration[5.2]
  def change
    remove_column :users, :token, :string
    remove_column :users, :token_expires_at, :integer
  end
end
