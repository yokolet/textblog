class ChangeColumnNullOfUsers < ActiveRecord::Migration[5.2]
  def change
    change_column_null :users, :provider, false
    change_column_null :users, :uid, false
    change_column_null :users, :name, false
    change_column_null :users, :email, false
  end
end
